package com.hospital.management.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Central Spring Security configuration for the hospital management system.
 * <p>
 * Configures a stateless, JWT-based security model with the following
 * characteristics:
 * <ul>
 * <li>CSRF disabled — appropriate for stateless REST APIs</li>
 * <li>No sessions — each request is independently authenticated via JWT</li>
 * <li>Method-level security enabled via {@code @PreAuthorize} — roles enforced
 * at the service boundary, not just at route level</li>
 * <li>Auth endpoints are publicly accessible; all others require
 * authentication</li>
 * </ul>
 * </p>
 * <p>
 * Designed for extensibility: future MFA, SSO (Entra ID/OIDC), and IP
 * allowlisting
 * can be layered in without restructuring this class.
 * </p>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize, @Secured on service methods
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Stateless REST API — CSRF not applicable
                .csrf(AbstractHttpConfigurer::disable)

                // No server-side sessions
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/actuator/health" // Health probe — adjust as needed
                        ).permitAll()

                        // Everything else requires a valid JWT
                        .anyRequest().authenticated())

                // Insert JWT filter before Spring's default username/password filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * BCrypt password encoder with strength 12.
     * <p>
     * Strength 12 is appropriate for a healthcare system. Revisit if login
     * latency becomes a concern on constrained hardware.
     * </p>
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}