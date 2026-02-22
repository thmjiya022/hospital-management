package com.hospital.management.service;

import com.hospital.management.model.dao.UserDao;
import com.hospital.management.model.domain.User;
import com.hospital.management.model.dto.auth.CreateUserRequest;
import com.hospital.management.model.dto.auth.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Application service for user management operations.
 * <p>
 * Handles admin-initiated account creation. Password hashing,
 * duplicate email checks, and entity mapping are all encapsulated
 * here so the controller layer stays thin.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a new user account.
     * <p>
     * Enforces unique email constraint and hashes the plain-text password
     * before persistence. The raw password is never stored.
     * </p>
     *
     * @param request the user creation payload
     * @return a {@link UserResponse} representing the created user
     * @throws IllegalArgumentException if the email is already in use
     */
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userDao.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("A user with email '" + request.getEmail() + "' already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setDepartmentId(request.getDepartmentId());
        user.setIsActive(true);

        User saved = userDao.save(user);
        log.info("User created [id={}, email={}, role={}]",
                saved.getId(), saved.getEmail(), saved.getRole());

        return toResponse(saved);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .departmentId(user.getDepartmentId())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}