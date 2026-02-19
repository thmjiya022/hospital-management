package com.hospital.management.model.dao;

import com.hospital.management.model.domain.Department;
import com.hospital.management.model.dao.base.AbstractBaseDao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DepartmentDao extends AbstractBaseDao<Department, UUID> {

    /**
     * Find department by exact name
     */
    Optional<Department> findByName(String name);

    /**
     * Find departments by partial name match (case insensitive)
     */
    List<Department> findByNameContaining(String name);

    /**
     * Check if department name exists
     */
    boolean existsByName(String name);

    /**
     * Find all active departments
     */
    List<Department> findAllActive();

    /**
     * Find departments with no staff assigned
     */
    List<Department> findDepartmentsWithNoStaff();

    /**
     * Count staff in department
     */
    long countStaffInDepartment(UUID departmentId);

    /**
     * Find departments by multiple IDs
     */
    List<Department> findByIds(List<UUID> ids);

    /**
     * Search departments by name or description
     */
    List<Department> search(String query);
}