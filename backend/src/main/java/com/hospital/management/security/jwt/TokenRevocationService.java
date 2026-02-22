package com.hospital.management.security.jwt;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenRevocationService {

    // In production, use Redis instead of ConcurrentHashMap
    private final ConcurrentHashMap<String, Instant> revokedTokens = new ConcurrentHashMap<>();

    /**
     * Revoke a token (add to blacklist)
     */
    public void revokeToken(String token) {
        if (token != null && !token.isEmpty()) {
            // Store with expiration (max token lifetime)
            revokedTokens.put(token, Instant.now().plusSeconds(86400)); // 24 hours
        }
    }

    /**
     * Check if token is revoked
     *
     * @param token
     * @return
     */
    public boolean isRevoked(String token) {
        Instant expiry = revokedTokens.get(token);
        if (expiry == null) {
            return false;
        }

        // Remove if expired
        if (expiry.isBefore(Instant.now())) {
            revokedTokens.remove(token);
            return false;
        }

        return true;
    }
    
    /**
     * Clean up expired tokens every hour
     */
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        revokedTokens.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}
