package com.shopsquare.profileservice.controller;

import com.shopsquare.profileservice.entity.Profile;
import com.shopsquare.profileservice.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@Tag(name = "Profile Management", description = "APIs for managing user profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    @Operation(summary = "Create a new profile", description = "Creates a new user profile in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Profile> createProfile(@RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.createProfile(profile));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get profile by ID", description = "Retrieves a specific profile by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile found successfully"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<Profile> getProfileById(
            @Parameter(description = "ID of the profile to retrieve", required = true)
            @PathVariable int id) {
        return profileService.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Get all profiles", description = "Retrieves a list of all profiles in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of profiles")
    })
    public ResponseEntity<List<Profile>> getAllProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update profile", description = "Updates an existing profile's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "404", description = "Profile not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Profile> updateProfile(
            @Parameter(description = "ID of the profile to update", required = true)
            @PathVariable int id, 
            @RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.updateProfile(id, profile));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete profile", description = "Deletes a profile from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Profile deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<Void> deleteProfile(
            @Parameter(description = "ID of the profile to delete", required = true)
            @PathVariable int id) {
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}
