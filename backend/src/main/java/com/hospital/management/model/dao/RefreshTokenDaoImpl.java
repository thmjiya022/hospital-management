package com.hospital.management.model.dao;

import com.hospital.management.model.dao.base.AbstractBaseDaoImpl;
import com.hospital.management.model.domain.RefreshToken;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementation of {@link RefreshTokenDao} for accessing {@link RefreshToken}
 * entities.
 * <p>
 * Extends {@link AbstractBaseDaoImpl} for generic CRUD and adds
 * token-specific queries for session lifecycle management.
 * </p>
 */
@Repository
public class RefreshTokenDaoImpl extends AbstractBaseDaoImpl<RefreshToken, UUID>
        implements RefreshTokenDao {

    /**
     * Finds an active (non-revoked, non-expired) refresh token by its hash.
     *
     * @param tokenHash the SHA-256 hash of the raw refresh token
     * @return an Optional containing the token if found and valid, otherwise empty
     */
    @Override
    public Optional<RefreshToken> findActiveByTokenHash(String tokenHash) {
        try {
            CriteriaBuilder builder = entityManager.getCriteriaBuilder();
            CriteriaQuery<RefreshToken> criteria = builder.createQuery(RefreshToken.class);
            Root<RefreshToken> root = criteria.from(RefreshToken.class);

            Predicate hashMatch = builder.equal(root.get("tokenHash"), tokenHash);
            Predicate notRevoked = builder.isFalse(root.get("revoked"));
            Predicate notExpired = builder.greaterThan(root.get("expiresAt"), LocalDateTime.now());

            criteria.select(root).where(builder.and(hashMatch, notRevoked, notExpired));

            RefreshToken token = entityManager.createQuery(criteria).getSingleResult();
            return Optional.ofNullable(token);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    /**
     * Finds all active (non-revoked, non-expired) refresh tokens for a specific
     * user.
     *
     * @param userId the UUID of the user
     * @return a list of active {@link RefreshToken} entities
     */
    @Override
    public List<RefreshToken> findActiveByUserId(UUID userId) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<RefreshToken> criteria = builder.createQuery(RefreshToken.class);
        Root<RefreshToken> root = criteria.from(RefreshToken.class);

        Predicate userMatch = builder.equal(root.get("userId"), userId);
        Predicate notRevoked = builder.isFalse(root.get("revoked"));
        Predicate notExpired = builder.greaterThan(root.get("expiresAt"), LocalDateTime.now());

        criteria.select(root)
                .where(builder.and(userMatch, notRevoked, notExpired))
                .orderBy(builder.desc(root.get("createdAt")));

        TypedQuery<RefreshToken> query = entityManager.createQuery(criteria);
        return query.getResultList();
    }

    /**
     * Revokes all refresh tokens for a user.
     * <p>
     * Called on password change, MFA enforcement, or admin-initiated lockout.
     * Sets revoked = true and stamps revoked_at on all active tokens.
     * </p>
     *
     * @param userId the UUID of the user whose tokens should be revoked
     */
    @Override
    @Transactional
    public void revokeAllForUser(UUID userId) {
        String jpql = "UPDATE RefreshToken t SET t.revoked = true, t.revokedAt = :now " +
                "WHERE t.userId = :userId AND t.revoked = false";

        entityManager.createQuery(jpql)
                .setParameter("now", LocalDateTime.now())
                .setParameter("userId", userId)
                .executeUpdate();
    }

    /**
     * Deletes all tokens that are both expired and revoked.
     * <p>
     * Intended to be called by a scheduled cleanup job to prevent
     * unbounded table growth in high-volume environments.
     * </p>
     */
    @Override
    @Transactional
    public void deleteExpiredAndRevoked() {
        String jpql = "DELETE FROM RefreshToken t " +
                "WHERE t.revoked = true AND t.expiresAt < :now";

        entityManager.createQuery(jpql)
                .setParameter("now", LocalDateTime.now())
                .executeUpdate();
    }
}