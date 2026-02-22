package com.hospital.management.security.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hospital.management.model.domain.User;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;

/**
 * Spring Security representation of the authenticated user.
 *
 * Wraps the domain {@link User} entity and adapts it to the
 * {@link UserDetails} contract required by Spring Security.
 */
public class UserPrincipal implements UserDetails {

    private final User user;
    private final Collection<? extends GrantedAuthority> authorities;

    private UserPrincipal(User user,
            Collection<? extends GrantedAuthority> authorities) {
        this.user = user;
        this.authorities = authorities;
    }

    /**
     * Factory method to create a UserPrincipal from a domain User.
     *
     * Maps the user's role to a Spring Security authority
     * in the format: ROLE_{ROLE_NAME}
     */
    public static UserPrincipal create(User user) {
        Objects.requireNonNull(user, "User cannot be null");
        Collection<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        
        return new UserPrincipal(user, authorities);
    }

    /**
     * Returns the underlying domain user.
     */
    public User getUser() {
        return user;
    }

    /**
     * Returns granted authorities for authorization checks.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    /**
     * Returns hashed password for authentication comparison.
     */
    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    /**
     * Uses email as the unique username for authentication.
     */
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    /**
     * Indicates whether the account has expired.
     * You can later extend this if you add expiration support.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the account is locked.
     * Currently tied to the user's active status.
     */
    @Override
    public boolean isAccountNonLocked() {
        return Boolean.TRUE.equals(user.getIsActive());
    }

    /**
     * Indicates whether credentials (password) are expired.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is enabled.
     */
    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(user.getIsActive());
    }
}