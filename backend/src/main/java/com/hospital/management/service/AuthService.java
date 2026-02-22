package com.hospital.management.service;

import com.hospital.management.model.dao.UserDao;
import com.hospital.management.model.domain.User;
import com.hospital.management.model.dto.auth.AuthResponse;
import com.hospital.management.model.dto.auth.LoginRequest;
import com.hospital.management.model.dto.auth.RefreshRequest;
import com.hospital.management.security.JwtProperties;
import com.hospital.management.security.JwtService;
import com.hospital.management.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Application service handling authentication flows.
 * <p>
 * Orchestrates credential validation, JWT issuance, token refresh,
 * and logout. All side-effectful operations (token persistence, revocation)
 * are delegated to {@link RefreshTokenService} and {@link JwtService}.
 * </p>
 * <p>
 * Intentionally avoids leaking security implementation details
 * (e.g. hashing algorithms, token format) to the controller layer.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserDao userDao;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final JwtProperties jwtProperties;

    /**
     * Login
     *
     * Authenticates a user with email and password.
     * <p>
     * On success: issues an access token and a refresh token.
     * On failure: throws a generic exception to prevent user enumeration.
     * </p>
     *
     * @param request   the login payload
     * @param ipAddress the caller's IP address
     * @return an {@link AuthResponse} with tokens and user metadata
     */
    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress) {
        User user = userDao.findByEmail(request.getEmail())
                .filter(u -> Boolean.TRUE.equals(u.getIsActive()))
                .orElseThrow(() -> new SecurityException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Failed login attempt for email [{}] from IP [{}]", request.getEmail(), ipAddress);
            throw new SecurityException("Invalid credentials");
        }

        return buildAuthResponse(user, request.getDeviceInfo(), ipAddress);
    }

    /**
     * Token refresh
     *
     * Exchanges a valid refresh token for a new access + refresh token pair.
     * <p>
     * The old refresh token is revoked on use (rotation). The user record
     * is re-fetched to ensure the account is still active and the role is current.
     * </p>
     *
     * @param request    the refresh token payload
     * @param deviceInfo optional device info
     * @param ipAddress  the caller's IP address
     * @return a new {@link AuthResponse}
     */
    @Transactional
    public AuthResponse refresh(RefreshRequest request, String deviceInfo, String ipAddress) {
        UUID userId = refreshTokenService.getUserIdFromRefreshToken(request.getRefreshToken());

        User user = userDao.findById(userId)
                .filter(u -> Boolean.TRUE.equals(u.getIsActive()))
                .orElseThrow(() -> new SecurityException("User account is inactive or does not exist"));

        // Rotate — revokes old token and issues a new one
        String newRefreshToken = refreshTokenService.rotateRefreshToken(
                request.getRefreshToken(), deviceInfo, ipAddress);

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .accessTokenExpiresInMs(jwtProperties.getAccessTokenExpiryMs())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    /**
     * Logout
     *
     * Logs out the user by revoking all their refresh tokens.
     * <p>
     * Access tokens will naturally expire; there is no server-side
     * blocklist for access tokens (by design, for scalability). If immediate
     * access token invalidation is required in future, a short-lived
     * Redis-backed blocklist can be added.
     * </p>
     *
     * @param userId the UUID of the user to log out
     */
    @Transactional
    public void logout(UUID userId) {
        refreshTokenService.revokeAllForUser(userId);
        log.info("All refresh tokens revoked for user [{}]", userId);
    }

    private AuthResponse buildAuthResponse(User user, String deviceInfo, String ipAddress) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = refreshTokenService.issueRefreshToken(user.getId(), deviceInfo, ipAddress);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresInMs(jwtProperties.getAccessTokenExpiryMs())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}