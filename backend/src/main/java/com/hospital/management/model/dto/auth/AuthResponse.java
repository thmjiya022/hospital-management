package com.hospital.management.model.dto.auth;

import com.hospital.management.constants.Role;
import lombok.Builder;
import lombok.Getter;

/**
 * Response payload returned after successful authentication.
 * <p>
 * Contains the short-lived access token (JWT) and the opaque refresh token.
 * The refresh token should be stored in an HttpOnly cookie by the client,
 * not in localStorage.
 * </p>
 */
@Getter
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private long accessTokenExpiresInMs;

    /**
     * Included so the UI can apply role-based rendering without decoding the JWT.
     */
    private Role role;
    private String firstName;
    private String lastName;
}