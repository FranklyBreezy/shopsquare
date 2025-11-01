package com.shopsquare.userservice.controller;

import com.shopsquare.userservice.entity.User;
import com.shopsquare.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @Operation(summary = "Create a new user", description = "Creates a new user in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves a list of all users in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users")
    })
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieves a specific user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public Optional<User> getUserById(
            @Parameter(description = "ID of the user to retrieve", required = true)
            @PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Updates an existing user's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public User updateUser(
            @Parameter(description = "ID of the user to update", required = true)
            @PathVariable Integer id, 
            @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Deletes a user from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public String deleteUser(
            @Parameter(description = "ID of the user to delete", required = true)
            @PathVariable Integer id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}
