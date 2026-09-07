package com.tripnest.backend.service;

import com.tripnest.backend.dto.ProfileResponse;
import com.tripnest.backend.dto.UpdateProfileRequest;
import com.tripnest.backend.entity.Destination;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.repository.DestinationRepository;
import com.tripnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public ProfileResponse getProfile(String email) {
        return ProfileResponse.from(currentUser(email));
    }

    public ProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = currentUser(email);

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getTravelPreferences() != null) user.setTravelPreferences(request.getTravelPreferences());
        if (request.getProfileImageUrl() != null) user.setProfileImageUrl(request.getProfileImageUrl());

        if (request.getFavoriteDestinationIds() != null) {
            Set<Destination> favorites = new HashSet<>(destinationRepository.findAllById(request.getFavoriteDestinationIds()));
            user.setFavoriteDestinations(favorites);
        }

        return ProfileResponse.from(userRepository.save(user));
    }
}
