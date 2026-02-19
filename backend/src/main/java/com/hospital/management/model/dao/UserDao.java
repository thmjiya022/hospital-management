package com.hospital.management.model.dao;

import java.util.Optional;
import java.util.UUID;

import com.hospital.management.model.dao.base.AbstractBaseDao;
import com.hospital.management.model.domain.User;

/**
 * Data Access Object (DAO) interface for {@link User} entities.
 * <p>
 * Extends the generic {@link AbstractBaseDao} to inherit standard CRUD
 * operations.
 * Adds user-specific queries such as finding by email and checking email
 * existence.
 * </p>
 *
 * @see AbstractBaseDao
 * @see User
 */
public interface UserDao extends AbstractBaseDao<User, UUID> {

    /**
     * Finds a user by their email address.
     *
     * @param email the email of the user
     * @return an Optional containing the user if found, otherwise empty
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether a user exists with the given email address.
     *
     * @param email the email to check
     * @return true if a user with the email exists, false otherwise
     */
    boolean existsByEmail(String email);
}
