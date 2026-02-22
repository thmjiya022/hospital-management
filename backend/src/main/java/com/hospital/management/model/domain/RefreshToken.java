package com.hospital.management.model.domain;

import com.hospital.management.model.domain.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a persisted, hashed refresh token tied to a user session.
 * <p>
 * Stored as a hash (never raw) to ensure that a database compromise
 * cannot be used to forge new sessions. Supports per-device tracking
 * and explicit revocation — the foundation for future MFA and SSO session
 * management.
 * </p>
 */
@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
public class RefreshToken extends BaseEntity {

    /**
     * The user this refresh token belongs to.
     */
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /**
     * SHA-256 hash of the raw refresh token.
     * Raw token is never persisted.
     */
    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    /**
     * Optional device or user-agent info for session visibility.
     */
    @Column(name = "device_info")
    private String deviceInfo;

    /**
     * IP address at time of issuance — useful for anomaly detection.
     */
    @Column(name = "ip_address")
    private String ipAddress;

    /**
     * Absolute expiry — checked independently of JWT claims.
     */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * Whether this token has been explicitly revoked (logout, MFA trigger, etc.).
     */
    @Column(name = "revoked", nullable = false)
    private Boolean revoked = false;

    /**
     * Timestamp of revocation, if applicable.
     */
    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;
}