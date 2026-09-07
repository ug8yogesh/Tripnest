package com.tripnest.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateProfileRequest {
    private String name;
    private String bio;
    private String travelPreferences;
    private String profileImageUrl;
    private List<Long> favoriteDestinationIds;
}
