package com.hospital.management.security.user;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import com.hospital.management.constants.Role;
import com.hospital.management.model.domain.User;

/**
 * Holds information about the currently authenticated user
 * for the duration of a single HTTP request.
 *
 * This bean is request-scoped, meaning a new instance is created
 * for each incoming request.
 *
 * It is populated by the JWT authentication filter
 * after successful token validation.
 */
@Component
@RequestScope
public class CurrentUser {

    /**
     * The authenticated user entity.
     */
    private User currentUser;

    /**
     * The JWT token associated with the current request.
     */
    private String currentToken;

    /**
     * Sets the current authenticated user and their token.
     *
     * @param user  authenticated user entity
     * @param token JWT token used for authentication
     */
    public void setCurrentUser(User user, String token) {
        this.currentUser = user;
        this.currentToken = token;
    }

    /**
     * @return the authenticated user, or null if not authenticated
     */
    public User getCurrentUser() {
        return currentUser;
    }

    /**
     * @return the JWT token for the current request
     */
    public String getCurrentToken() {
        return currentToken;
    }

    /**
     * @return true if a user is authenticated for this request
     */
    public boolean isAuthenticated() {
        return currentUser != null;
    }

    /**
     * Checks if the current user has the given role.
     *
     * @param role required role
     * @return true if the user has the specified role
     */
    public boolean hasRole(Role role) {
        return isAuthenticated() && currentUser.getRole() == role;
    }

    public boolean isAdmin() {
        return hasRole(Role.ADMIN);
    }

    public boolean isDoctor() {
        return hasRole(Role.DOCTOR);
    }

    public boolean isReceptionist() {
        return hasRole(Role.RECEPTIONIST);
    }

    public boolean isNurse() {
        return hasRole(Role.NURSE);
    }

    /**
     * Clears the current user context.
     * Usually called at the end of request processing.
     */
    public void clear() {
        this.currentUser = null;
        this.currentToken = null;
    }
}