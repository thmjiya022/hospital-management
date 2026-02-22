package com.hospital.management.model.dto.auth;

import com.hospital.management.constants.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Request payload for creating a new user account.
 * <p>
 * Only accessible to ADMIN users. Supports assigning a department
 * and role at creation time.
 * </p>
 */
@Getter
@Setter
public class CreateUserRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    /** Optional — staff can be assigned to a department at creation time. */
    private UUID departmentId;

    /** Optional contact number. */
    private String phone;
}