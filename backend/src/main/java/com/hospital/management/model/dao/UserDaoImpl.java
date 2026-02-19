package com.hospital.management.model.dao;

import com.hospital.management.model.domain.User;
import com.hospital.management.model.dao.base.AbstractBaseDaoImpl;
import jakarta.persistence.NoResultException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Implementation of {@link UserDao} for accessing {@link User} entities.
 * <p>
 * Extends {@link AbstractBaseDaoImpl} to provide generic CRUD operations
 * and adds user-specific queries such as finding by email and checking email existence.
 * </p>
 */
@Repository
public class UserDaoImpl extends AbstractBaseDaoImpl<User, UUID> implements UserDao{
    
    /**
     * Finds a user by their email address.
     *
     * @param email the email of the user
     * @return an Optional containing the user if found, otherwise empty
     */
    @Override
    public Optional<User> findByEmail(String email) {
        try{
            CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
            CriteriaQuery<User> query = criteriaBuilder.createQuery(User.class);
            Root<User> userRoot =  query.from(User.class);
            query.select(userRoot).where(criteriaBuilder.equal(userRoot.get("emai"), email));

            User user = entityManager.createQuery(query).getSingleResult();
            return Optional.ofNullable(user);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    /**
     * Checks whether a user exists with the given email address.
     *
     * @param email the email to check
     * @return true if a user with the email exists, false otherwise
     */
    @Override
    public boolean existsByEmail(String email) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<User> userRoot = countQuery.from(User.class);
        countQuery.select(criteriaBuilder.count(userRoot)).where(criteriaBuilder.equal(userRoot.get("email"), email));

        Long count = entityManager.createQuery(countQuery).getSingleResult();
        return count > 0;
    }
}
