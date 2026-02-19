package com.hospital.management.model.dao.base;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * Generic Data Access Object (DAO) interface that defines
 * standard CRUD operations for any entity type.
 *
 * @param <T>  the type of entity
 * @param <ID> the type of the entity's identifier, must be Serializable
 */
public interface AbstractBaseDao<T, ID extends Serializable> {

    /**
     * Saves a new entity in the database.
     *
     * @param entity the entity to save
     * @return the saved entity with any auto-generated fields populated
     */
    T save(T entity);

    /**
     * Finds an entity by its identifier.
     *
     * @param id the identifier of the entity
     * @return an Optional containing the found entity if it exists, otherwise empty
     */
    Optional<T> findById(ID id);

    /**
     * Retrieves all entities of this type from the database.
     *
     * @return a List of all entities, possibly empty if none exist
     */
    List<T> findAll();

    /**
     * Updates an existing entity in the database.
     *
     * @param entity the entity to update
     * @return the updated entity
     */
    T update(T entity);

    /**
     * Deletes the given entity from the database.
     *
     * @param entity the entity to delete
     */
    void delete(T entity);

    /**
     * Deletes an entity by its identifier.
     *
     * @param id the identifier of the entity to delete
     */
    void deleteById(ID id);

    /**
     * Returns the total number of entities of this type in the database.
     *
     * @return the number of entities
     */
    long count();

    /**
     * Checks if an entity with the given identifier exists.
     *
     * @param id the identifier to check
     * @return true if an entity with the given ID exists, false otherwise
     */
    boolean existsById(ID id);
}
