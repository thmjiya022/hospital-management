package com.hospital.management.model.domain;

import java.util.UUID;

import com.hospital.management.constants.Role;
import com.hospital.management.model.domain.base.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a user within the hospital system, such as a doctor, nurse, or
 * administrator.
 * <p>
 * Extends {@link BaseEntity} to inherit common fields like UUID id, createdAt,
 * and updatedAt.
 * </p>
 * <p>
 * Each user has a unique email, password hash, first and last name, role, and
 * optional contact information.
 * Users may be associated with a department via departmentId, and have an
 * active status flag.
 * </p>
 */
@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {

    /**
     * Unique email address of the user.
     */
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /**
     * Hashed password for authentication.
     */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /**
     * First name of the user.
     */
    @Column(name = "first_name", nullable = false)
    private String firstName;

    /**
     * Last name of the user.
     */
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /**
     * Optional phone number of the user.
     */
    @Column(name = "phone")
    private String phone;

    /**
     * Role of the user within the system (e.g., DOCTOR, NURSE, ADMIN).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    /**
     * Identifier of the department the user belongs to.
     */
    @Column(name = "department_id")
    private UUID departmentId;

    /**
     * Indicates whether the user is active.
     * Defaults to true.
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
