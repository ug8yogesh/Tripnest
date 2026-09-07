package com.tripnest.backend.dto;

import lombok.Data;

@Data
public class DestinationRequest {
    private String name;
    private String country;
    private String description;
    private String imageUrl;
    private String bestTimeToVisit;
    private Boolean isPopular;
    private Double latitude;
    private Double longitude;
}
