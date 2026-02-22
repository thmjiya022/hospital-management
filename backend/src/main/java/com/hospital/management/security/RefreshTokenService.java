package com.hospital.management.security;

import com.hospital.management.model.dao.RefreshTokenDao;
import com.hospital.management.model.domain.RefreshToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

/**
 * Service responsible for the full lifecycle of refresh tokens.
 * <p>
 * Raw tokens are generated as cryptographically random UUIDs and are
 * only ever returned to the caller once. Only the SHA-256 hash is persisted,
 * so a database compromise cannot yield usable tokens.
 * </p>
 * <p>
 * Handles issuance, rotation (old token revoked on use), and full
 * revocation for events like password change or MFA enforcement.
 * </p>
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenDao refreshTokenDao;
    private final JwtProperties jwtProperties;

    // -------------------------------------------------------------------------
    // Issuance
    // -------------------------------------------------------------------------

    /**
     * Issues a new refresh token for the given user.
     *
     * @param userId     the user's UUID
     * @param deviceInfo optional device or user-agent string
     * @param ipAddress  the request IP address
     * @return the raw (unhashed) refresh token to be sent to the client
     */
    @Transactional
    public String issueRefreshToken(UUID userId, String deviceInfo, String ipAddress) {
        String rawToken = UUID.randomUUID().toString() + UUID.randomUUID(); // 72 random chars

        RefreshToken entity = new RefreshToken();
        entity.setUserId(userId);
        entity.setTokenHash(hash(rawToken));
        entity.setDeviceInfo(deviceInfo);
        entity.setIpAddress(ipAddress);
        entity.setExpiresAt(LocalDateTime.now()
                .plusSeconds(jwtProperties.getRefreshTokenExpiryMs() / 1000));
        entity.setRevoked(false);

        refreshTokenDao.save(entity);

        return rawToken;
    }

    // -------------------------------------------------------------------------
    // Rotation
    // -------------------------------------------------------------------------

    /**
     * Validates an incoming refresh token and rotates it.
     * <p>
     * The old token is revoked and a new one is issued. Rotation limits
     * the blast radius of a stolen refresh token.
     * </p>
     *
     * @param rawToken   the raw refresh token from the client
     * @param deviceInfo optional device info
     * @param ipAddress  the request IP
     * @return a new raw refresh token
     * @throws SecurityException if the token is invalid, expired, or revoked
     */
    @Transactional
    public String rotateRefreshToken(String rawToken, String deviceInfo, String ipAddress) {
        RefreshToken existing = refreshTokenDao
                .findActiveByTokenHash(hash(rawToken))
                .orElseThrow(() -> new SecurityException("Refresh token is invalid or expired"));

        // Revoke the consumed token
        existing.setRevoked(true);
        existing.setRevokedAt(LocalDateTime.now());
        refreshTokenDao.update(existing);

        // Issue a fresh token for the same user
        return issueRefreshToken(existing.getUserId(), deviceInfo, ipAddress);
    }

    // -------------------------------------------------------------------------
    // Revocation
    // -------------------------------------------------------------------------

    /**
     * Revokes all refresh tokens for a user.
     * <p>
     * Called on password change, MFA enforced, admin lock, or SSO session
     * termination.
     * </p>
     *
     * @param userId the UUID of the user
     */
    @Transactional
    public void revokeAllForUser(UUID userId) {
        refreshTokenDao.revokeAllForUser(userId);
    }

    /**
     * Looks up the userId associated with a valid raw refresh token.
     *
     * @param rawToken the raw refresh token
     * @return the associated user UUID
     * @throws SecurityException if the token is invalid or expired
     */
    public UUID getUserIdFromRefreshToken(String rawToken) {
        return refreshTokenDao
                .findActiveByTokenHash(hash(rawToken))
                .orElseThrow(() -> new SecurityException("Refresh token is invalid or expired"))
                .getUserId();
    }

    // -------------------------------------------------------------------------
    // Internal
    // -------------------------------------------------------------------------

    private String hash(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}