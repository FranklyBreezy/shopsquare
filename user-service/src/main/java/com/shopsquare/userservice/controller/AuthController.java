package com.shopsquare.userservice.controller;

import com.shopsquare.userservice.entity.Role;
import com.shopsquare.userservice.entity.User;
import com.shopsquare.userservice.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            // Properly handle null values
            String email = body.get("email") != null ? String.valueOf(body.get("email")) : null;
            String name = body.get("name") != null ? String.valueOf(body.get("name")) : null;
            String password = body.get("password") != null ? String.valueOf(body.get("password")) : null;
            String roleStr = body.getOrDefault("role", "CUSTOMER") != null ? String.valueOf(body.getOrDefault("role", "CUSTOMER")) : "CUSTOMER";

            // Validate required fields
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required");
            }
            
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Name is required");
            }
            
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is required");
            }

            // Check if email already exists
            if (userRepository.findByEmail(email.trim()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            }

            // Validate and set role
            Role role;
            try {
                role = Role.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                role = Role.CUSTOMER; // Default to CUSTOMER if invalid role
            }

            // Create and save user
            User user = new User();
            user.setEmail(email.trim());
            user.setName(name.trim());
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));
        } catch (Exception ex) {
            // Log the exception for debugging
            System.err.println("Registration error: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: " + ex.getMessage());
        }
    }

    @PostMapping("/test")
    public ResponseEntity<?> test(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of(
                "received", body,
                "email", body.get("email"),
                "name", body.get("name"),
                "password", body.get("password"),
                "role", body.get("role")
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        // Properly handle null values
        String email = body.get("email") != null ? String.valueOf(body.get("email")) : null;
        String password = body.get("password") != null ? String.valueOf(body.get("password")) : null;
        
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
        }

        User user = userRepository.findByEmail(email.trim());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Debug: Check if password hash is BCrypt format
        boolean isPasswordValid;
        if (user.getPasswordHash().startsWith("$2a$") || user.getPasswordHash().startsWith("$2b$")) {
            // BCrypt hash
            isPasswordValid = passwordEncoder.matches(password, user.getPasswordHash());
        } else {
            // Plain text (for backward compatibility with existing users)
            isPasswordValid = password.equals(user.getPasswordHash());
        }
        
        if (!isPasswordValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Minimal response compatible with UI structure
        return ResponseEntity.ok(Map.of(
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole().name()
                ),
                "token", "dummy-token"
        ));
    }
}


