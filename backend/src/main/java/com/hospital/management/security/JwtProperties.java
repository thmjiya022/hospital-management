package com.hospital.management.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Typed binding for JWT configuration from application.yml.
 * <p>
 * Centralises all tunable JWT parameters so rotating secrets,
 * adjusting expiry windows, or switching issuers requires a single
 * config change — not a code change.
 * </p>
 */
@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {

    /**
     * Base64-encoded 512-bit HMAC secret — must be set via environment variable.
     */
    private String secret;

    /** Access token lifetime in milliseconds (default 15 min). */
    private long accessTokenExpiryMs;

    /** Refresh token lifetime in milliseconds (default 7 days). */
    private long refreshTokenExpiryMs;

    /** JWT issuer claim value. */
    private String issuer;
}