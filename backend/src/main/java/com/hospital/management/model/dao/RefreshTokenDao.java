package com.hospital.management.model.dao;

import com.hospital.management.model.dao.base.AbstractBaseDao;
import com.hospital.management.model.domain.RefreshToken;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Data Access Object interface for {@link RefreshToken} entities.
 * <p>
 * Extends {@link AbstractBaseDao} for standard CRUD operations and adds
 * token-specific queries needed for session management, revocation,
 * and future MFA/SSO audit flows.
 * </p>
 */
public interface RefreshTokenDao extends AbstractBaseDao<RefreshToken, UUID> {

    /**
     * Finds an active (non-revoked, non-expired) refresh token by its hash.
     */
    Optional<RefreshToken> findActiveByTokenHash(String tokenHash);

    /**
     * Finds all active tokens for a user — used for session listing and forced
     * logout.
     */
    List<RefreshToken> findActiveByUserId(UUID userId);

    /**
     * Revokes all tokens for a user — triggered on password change, MFA enable, or
     * admin lockout.
     */
    void revokeAllForUser(UUID userId);

    /**
     * Deletes tokens that are both expired and revoked — run by a scheduled cleanup
     * job.
     */
    void deleteExpiredAndRevoked();
}