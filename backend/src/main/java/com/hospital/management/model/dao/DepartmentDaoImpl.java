package com.hospital.management.model.dao;

import com.hospital.management.model.domain.Department;
import com.hospital.management.model.dao.base.AbstractBaseDaoImpl;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementation of {@link DepartmentDao} for accessing {@link Department}
 * entities.
 * <p>
 * Extends {@link AbstractBaseDaoImpl} to provide generic CRUD operations
 * and adds department-specific queries such as searching by name, filtering
 * active departments,
 * counting staff members, and handling business rules for deletion and saving.
 * </p>
 */
@Repository
public class DepartmentDaoImpl extends AbstractBaseDaoImpl<Department, UUID> implements DepartmentDao {

    /**
     * Finds a department by its exact name.
     *
     * @param name the exact name of the department
     * @return an {@link Optional} containing the department if found, otherwise
     *         empty
     */
    @Override
    public Optional<Department> findByName(String name) {
        try {
            CriteriaBuilder builder = entityManager.getCriteriaBuilder();
            CriteriaQuery<Department> criteria = builder.createQuery(Department.class);
            Root<Department> departmentRoot = criteria.from(Department.class);

            criteria.select(departmentRoot)
                    .where(builder.equal(departmentRoot.get("name"), name));

            TypedQuery<Department> query = entityManager.createQuery(criteria);
            Department department = query.getSingleResult();

            return Optional.ofNullable(department);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    /**
     * Finds departments whose names contain the given substring (case-insensitive).
     *
     * @param name the substring to search for
     * @return a list of matching {@link Department} entities
     */
    @Override
    public List<Department> findByNameContaining(String name) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Department> criteria = builder.createQuery(Department.class);
        Root<Department> departmentRoot = criteria.from(Department.class);

        criteria.select(departmentRoot)
                .where(builder.like(builder.lower(departmentRoot.get("name")),
                        "%" + name.toLowerCase() + "%"))
                .orderBy(builder.asc(departmentRoot.get("name")));

        TypedQuery<Department> query = entityManager.createQuery(criteria);
        return query.getResultList();
    }

    /**
     * Checks whether a department with the given name exists.
     *
     * @param name the name to check
     * @return true if a department with the name exists, false otherwise
     */
    @Override
    public boolean existsByName(String name) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countCriteria = builder.createQuery(Long.class);
        Root<Department> departmentRoot = countCriteria.from(Department.class);

        countCriteria.select(builder.count(departmentRoot))
                .where(builder.equal(departmentRoot.get("name"), name));

        TypedQuery<Long> query = entityManager.createQuery(countCriteria);
        Long count = query.getSingleResult();

        return count > 0;
    }

    /**
     * Retrieves all active departments.
     *
     * @return a list of active {@link Department} entities
     */
    @Override
    public List<Department> findAllActive() {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Department> criteria = builder.createQuery(Department.class);
        Root<Department> departmentRoot = criteria.from(Department.class);

        criteria.select(departmentRoot)
                .where(builder.isTrue(departmentRoot.get("isActive")))
                .orderBy(builder.asc(departmentRoot.get("name")));

        TypedQuery<Department> query = entityManager.createQuery(criteria);
        return query.getResultList();
    }

    /**
     * Finds departments that have no staff members assigned.
     *
     * @return a list of {@link Department} entities with no staff
     */
    @Override
    public List<Department> findDepartmentsWithNoStaff() {
        String jpql = "SELECT d FROM Department d " +
                "WHERE NOT EXISTS (SELECT u FROM User u WHERE u.departmentId = d.id) " +
                "ORDER BY d.name";

        TypedQuery<Department> query = entityManager.createQuery(jpql, Department.class);
        return query.getResultList();
    }

    /**
     * Counts the number of staff members in a department.
     *
     * @param departmentId the UUID of the department
     * @return the number of staff members in the department
     */
    @Override
    public long countStaffInDepartment(UUID departmentId) {
        String jpql = "SELECT COUNT(u) FROM User u WHERE u.departmentId = :deptId";

        TypedQuery<Long> query = entityManager.createQuery(jpql, Long.class);
        query.setParameter("deptId", departmentId);

        return query.getSingleResult();
    }

    /**
     * Finds departments by a list of IDs.
     *
     * @param ids the list of department UUIDs
     * @return a list of {@link Department} entities matching the IDs
     */
    @Override
    public List<Department> findByIds(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }

        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Department> criteria = builder.createQuery(Department.class);
        Root<Department> departmentRoot = criteria.from(Department.class);

        criteria.select(departmentRoot)
                .where(departmentRoot.get("id").in(ids))
                .orderBy(builder.asc(departmentRoot.get("name")));

        TypedQuery<Department> query = entityManager.createQuery(criteria);
        return query.getResultList();
    }

    /**
     * Searches departments by name or description (case-insensitive), limited to 50
     * results.
     *
     * @param searchTerm the term to search in name or description
     * @return a list of matching {@link Department} entities
     */
    @Override
    public List<Department> search(String searchTerm) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Department> criteria = builder.createQuery(Department.class);
        Root<Department> departmentRoot = criteria.from(Department.class);

        String pattern = "%" + searchTerm.toLowerCase() + "%";

        Predicate namePredicate = builder.like(builder.lower(departmentRoot.get("name")), pattern);
        Predicate descriptionPredicate = builder.like(builder.lower(departmentRoot.get("description")), pattern);

        criteria.select(departmentRoot)
                .where(builder.or(namePredicate, descriptionPredicate))
                .orderBy(builder.asc(departmentRoot.get("name")));

        TypedQuery<Department> query = entityManager.createQuery(criteria);
        query.setMaxResults(50); // Limit results for performance

        return query.getResultList();
    }

    /**
     * Saves a department while enforcing the business rule that department names
     * must be unique.
     *
     * @param department the {@link Department} entity to save
     * @return the saved {@link Department} entity
     * @throws RuntimeException if a department with the same name already exists
     */
    @Override
    public Department save(Department department) {
        if (department.getId() == null) { // New department
            if (existsByName(department.getName())) {
                throw new RuntimeException("Department with name '" +
                        department.getName() + "' already exists");
            }
        } else { // Updating existing department
            Optional<Department> existing = findByName(department.getName());
            if (existing.isPresent() && !existing.get().getId().equals(department.getId())) {
                throw new RuntimeException("Another department with name '" + department.getName() + "' already exists");
            }
        }

        return super.save(department);
    }

    /**
     * Soft deletes a department by marking it inactive.
     * Prevents deletion if the department has staff assigned.
     *
     * @param department the {@link Department} entity to delete
     * @throws RuntimeException if the department has staff members assigned
     */
    @Override
    public void delete(Department department) {
        long staffCount = countStaffInDepartment(department.getId());

        if (staffCount > 0) {
            throw new RuntimeException(
                "Cannot delete department with " + staffCount +
                " staff members assigned. Please reassign them first."
            );
        }

        department.setIsActive(false);
        super.update(department);
    }

    /**
     * Deletes a department by its ID using soft deletion.
     *
     * @param id the UUID of the department to delete
     */
    @Override
    public void deleteById(UUID id) {
        findById(id).ifPresent(this::delete);
    }

    /**
     * Permanently deletes a department from the database.
     * <p>
     * Use with caution, as this bypasses soft deletion rules.
     * </p>
     *
     * @param department the {@link Department} entity to hard delete
     */
    public void hardDelete(Department department) {
        super.delete(department);
    }
}