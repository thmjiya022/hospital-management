package com.hospital.management.controller;

import com.hospital.management.model.dto.auth.CreateUserRequest;
import com.hospital.management.model.dto.auth.UserResponse;
import com.hospital.management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

/**
 * REST controller for user management operations.
 * <p>
 * All endpoints require ADMIN role — enforced at the method level
 * via {@code @PreAuthorize} so the restriction survives any future
 * route restructuring.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Creates a new user account.
     * <p>
     * Returns 201 Created with a Location header pointing to the new resource
     * and the created user in the body.
     * </p>
     *
     * @param request the user creation payload
     * @return 201 with {@link UserResponse}
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse response = userService.createUser(request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }
}