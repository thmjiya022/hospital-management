package com.hospital.management.security;

import com.hospital.management.constants.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/**
 * Service responsible for generating and validating JWT access tokens.
 * <p>
 * Access tokens are short-lived and signed with HMAC-SHA512.
 * They embed the user's ID, role, and email as claims, so downstream
 * services can authorise requests without a database call.
 * </p>
 * <p>
 * This class is intentionally stateless — it does not touch the database.
 * Refresh token persistence is handled by
 * {@link com.hospital.management.model.dao.RefreshTokenDao}.
 * </p>
 * <p>
 * Designed with future extensibility in mind: the claims structure is
 * compatible with OIDC-style tokens, making SSO/Entra integration
 * straightforward.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    /**
     * Generates a signed JWT access token for the given user.
     *
     * @param userId the user's UUID
     * @param email  the user's email (used as subject)
     * @param role   the user's role
     * @return a compact, signed JWT string
     */
    public String generateAccessToken(UUID userId, String email, Role role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getAccessTokenExpiryMs());

        return Jwts.builder()
                .issuer(jwtProperties.getIssuer())
                .subject(email)
                .claim("userId", userId.toString())
                .claim("role", role.name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey(), Jwts.SIG.HS512)
                .compact();
    }

    /**
     * Validates a JWT access token and returns its parsed claims.
     *
     * @param token the compact JWT string
     * @return the parsed {@link Claims} if valid
     * @throws JwtException if the token is invalid, expired, or tampered with
     */
    public Claims validateAndExtractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extracts the user ID from a validated JWT token.
     *
     * @param token the compact JWT string
     * @return the user's UUID
     */
    public UUID extractUserId(String token) {
        Claims claims = validateAndExtractClaims(token);
        return UUID.fromString(claims.get("userId", String.class));
    }

    /**
     * Extracts the role from a validated JWT token.
     *
     * @param token the compact JWT string
     * @return the user's {@link Role}
     */
    public Role extractRole(String token) {
        Claims claims = validateAndExtractClaims(token);
        return Role.valueOf(claims.get("role", String.class));
    }

    /**
     * Returns whether the given token is valid (not expired, not tampered).
     *
     * @param token the compact JWT string
     * @return true if the token is valid, false otherwise
     */
    public boolean isTokenValid(String token) {
        try {
            validateAndExtractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(
                jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }
}