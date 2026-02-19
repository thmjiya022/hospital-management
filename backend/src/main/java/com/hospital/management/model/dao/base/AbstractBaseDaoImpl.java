package com.hospital.management.model.dao.base;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Optional;

/**
 * Abstract implementation of the {@link AbstractBaseDao} interface using JPA.
 * <p>
 * Provides generic CRUD operations for any entity type, leveraging the JPA
 * EntityManager.
 * This class handles basic persistence operations such as save, update, delete,
 * retrieval by ID, listing all entities, counting entities, and existence
 * checks.
 * </p>
 * <p>
 * Subclasses can extend this class to inherit standard DAO functionality
 * without repeating common persistence logic.
 * </p>
 *
 * @param <T>  the type of the entity
 * @param <ID> the type of the entity's identifier, must be Serializable
 */
public class AbstractBaseDaoImpl<T, ID extends Serializable> implements AbstractBaseDao<T, ID> {

    @PersistenceContext
    protected EntityManager entityManager;

    private Class<T> entityClass;

    @SuppressWarnings("unchecked")
    public AbstractBaseDaoImpl() {
        this.entityClass = (Class<T>) ((ParameterizedType) getClass()
                .getGenericSuperclass())
                .getActualTypeArguments()[0];
    }

    @Override
    @Transactional
    public T save(T entity) {
        entityManager.persist(entity);
        return entity;
    }

    @Override
    public Optional<T> findById(ID id) {
        T entity = entityManager.find(entityClass, id);
        return Optional.ofNullable(entity);
    }

    @Override
    public List<T> findAll() {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = criteriaBuilder.createQuery(entityClass);
        query.select(query.from(entityClass));
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    @Transactional
    public T update(T entity) {
        return entityManager.merge(entity);
    }

    @Override
    @Transactional
    public void delete(T entity) {
        entityManager.remove(entity);
    }

    @Override
    @Transactional
    public void deleteById(ID id) {
        findById(id).ifPresent(this::delete);
    }

    @Override
    public long count() {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        countQuery.select(criteriaBuilder.count(countQuery.from(entityClass)));
        return entityManager.createQuery(countQuery).getSingleResult();
    }

    @Override
    public boolean existsById(ID id) {
        return findById(id).isPresent();
    }
}
