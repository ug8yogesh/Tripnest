package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.ProfileResponse;
import com.tripnest.backend.dto.UpdateProfileRequest;
import com.tripnest.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication auth) {
        return ResponseEntity.ok(profileService.getProfile(auth.getName()));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(Authentication auth, @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(auth.getName(), request));
    }
}
