package com.shopsquare.profileservice.service;

import com.shopsquare.profileservice.entity.Profile;

import java.util.List;
import java.util.Optional;

public interface ProfileService {
    Profile createProfile(Profile profile);

    Optional<Profile> getProfileById(int id);

    List<Profile> getAllProfiles();

    Profile updateProfile(int id, Profile profile);

    void deleteProfile(int id);
}
