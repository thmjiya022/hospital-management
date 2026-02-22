package com.hospital.management.model.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Request payload for the token refresh endpoint.
 */
@Getter
@Setter
public class RefreshRequest {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}