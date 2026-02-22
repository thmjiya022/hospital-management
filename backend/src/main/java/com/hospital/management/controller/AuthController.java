package com.hospital.management.controller;

import com.hospital.management.model.dto.auth.AuthResponse;
import com.hospital.management.model.dto.auth.LoginRequest;
import com.hospital.management.model.dto.auth.RefreshRequest;
import com.hospital.management.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller exposing authentication endpoints.
 * <p>
 * All endpoints under /api/v1/auth are publicly accessible (see
 * SecurityConfig).
 * The logout endpoint requires an authenticated request — the user ID is
 * extracted
 * from the validated JWT via {@code @AuthenticationPrincipal}.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Authenticates a user and returns an access token and refresh token.
     *
     * @param request     the login credentials
     * @param httpRequest used to capture the caller's IP address
     * @return 200 with {@link AuthResponse}, or 401 on bad credentials
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request, httpRequest.getRemoteAddr());
        return ResponseEntity.ok(response);
    }

    /**
     * Exchanges a valid refresh token for a new access + refresh token pair.
     *
     * @param request     the refresh token payload
     * @param httpRequest used to capture the caller's IP address
     * @return 200 with a new {@link AuthResponse}
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request,
            HttpServletRequest httpRequest) {
        AuthResponse response = authService.refresh(
                request,
                httpRequest.getHeader("User-Agent"),
                httpRequest.getRemoteAddr());
        return ResponseEntity.ok(response);
    }

    /**
     * Revokes all refresh tokens for the authenticated user.
     *
     * @param userId injected from the validated JWT by Spring Security
     * @return 204 No Content
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UUID userId) {
        authService.logout(userId);
        return ResponseEntity.noContent().build();
    }
}