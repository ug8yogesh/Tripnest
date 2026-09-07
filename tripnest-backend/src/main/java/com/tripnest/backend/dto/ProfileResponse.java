package com.tripnest.backend.dto;

import com.tripnest.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String bio;
    private String travelPreferences;
    private String profileImageUrl;
    private List<String> favoriteDestinations;
    private List<Long> favoriteDestinationIds;
    private LocalDateTime createdAt;

    public static ProfileResponse from(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getRoleName().name() : null,
                user.getBio(),
                user.getTravelPreferences(),
                user.getProfileImageUrl(),
                user.getFavoriteDestinations().stream().map(com.tripnest.backend.entity.Destination::getName).toList(),
                user.getFavoriteDestinations().stream().map(com.tripnest.backend.entity.Destination::getId).toList(),
                user.getCreatedAt()
        );
    }
}
