package com.hospital.management.model.domain;

import java.util.ArrayList;
import java.util.List;

import com.hospital.management.model.domain.base.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a department within the hospital, such as Cardiology, Radiology,
 * or Emergency.
 * <p>
 * Extends {@link BaseEntity} to inherit common fields like UUID id, createdAt,
 * and updatedAt.
 * </p>
 * <p>
 * Each department has a unique name, an optional description, and an active
 * status flag.
 * It also maintains a list of staff members (e.g., doctors, nurses) associated
 * with the department.
 * </p>
 */
@Entity
@Table(name = "departments")
@Getter
@Setter
public class Department extends BaseEntity {

    /**
     * Name of the department (e.g., "Cardiology").
     * Must be unique and not null.
     */
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    /**
     * Optional description providing additional information about the department.
     */
    @Column(name = "description")
    private String description;

    /**
     * Indicates whether the department is active.
     * Defaults to true.
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /**
     * List of staff members associated with this department (e.g., doctors,nurses).
     * One department can have many users.
     */
    @OneToMany(mappedBy = "department")
    private List<User> staff = new ArrayList<>();
}
