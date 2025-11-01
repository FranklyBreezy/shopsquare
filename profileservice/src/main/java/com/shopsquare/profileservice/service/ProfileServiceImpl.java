package com.shopsquare.profileservice.service;

import com.shopsquare.profileservice.entity.Profile;
import com.shopsquare.profileservice.repository.ProfileRepository;
import com.shopsquare.profileservice.service.ProfileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final RestTemplate restTemplate;

    @Value("${service.user-service.name:user-service}")
    private String userServiceName;

    public ProfileServiceImpl(ProfileRepository profileRepository, RestTemplate restTemplate) {
        this.profileRepository = profileRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public Profile createProfile(Profile profile) {
        if (profile.getUserId() > 0) {
            String url = "http://" + userServiceName + "/api/users/" + profile.getUserId();
            restTemplate.getForObject(url, Object.class);
        }
        profile.setCreatedAt(LocalDateTime.now());
        return profileRepository.save(profile);
    }

    @Override
    public Optional<Profile> getProfileById(int id) {
        return profileRepository.findById(id);
    }

    @Override
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    @Override
    public Profile updateProfile(int id, Profile profile) {
        Optional<Profile> existingProfileOpt = profileRepository.findById(id);
        if (existingProfileOpt.isPresent()) {
            Profile existingProfile = existingProfileOpt.get();
            existingProfile.setUserId(profile.getUserId());
            existingProfile.setName(profile.getName());
            existingProfile.setAddress(profile.getAddress());
            existingProfile.setPhone(profile.getPhone());
            return profileRepository.save(existingProfile);
        }
        throw new RuntimeException("Profile not found with id: " + id);
    }

    @Override
    public void deleteProfile(int id) {
        profileRepository.deleteById(id);
    }
}
