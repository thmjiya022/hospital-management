package com.hospital.management.security;

import com.hospital.management.constants.Role;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Servlet filter that validates JWT access tokens on every incoming request.
 * <p>
 * Runs once per request ({@link OncePerRequestFilter}). Extracts the Bearer
 * token
 * from the Authorization header, validates it via {@link JwtService}, and
 * populates
 * the Spring Security context so downstream handlers and method-level security
 * annotations (@PreAuthorize) can function correctly.
 * </p>
 * <p>
 * This filter is intentionally stateless — it does not hit the database.
 * Refresh token validation is a separate, explicit operation handled by
 * {@link RefreshTokenService}.
 * </p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Skip filter for auth endpoints
        if (request.getRequestURI().startsWith("/api/v1/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = extractBearerToken(request);

        if (token != null) {
            try {
                UUID userId = jwtService.extractUserId(token);
                Role role = jwtService.extractRole(token);

                // Build the authentication object with role as a granted authority
                var authentication = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role.name())));

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (JwtException e) {
                log.debug("JWT rejected for request [{}]: {}", request.getRequestURI(), e.getMessage());
                // Do not set authentication — request will be rejected by Spring Security
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extracts the raw JWT from the Authorization: Bearer <token> header.
     *
     * @param request the incoming HTTP request
     * @return the token string, or null if not present or malformed
     */
    private String extractBearerToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}