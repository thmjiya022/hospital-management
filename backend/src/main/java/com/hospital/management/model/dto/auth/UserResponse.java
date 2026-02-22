package com.hospital.management.model.dto.auth;

import com.hospital.management.constants.Role;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response payload returned after creating or retrieving a user.
 * <p>
 * Never exposes the password hash.
 * </p>
 */
@Getter
@Builder
public class UserResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private String phone;
    private UUID departmentId;
    private Boolean isActive;
    private LocalDateTime createdAt;
}