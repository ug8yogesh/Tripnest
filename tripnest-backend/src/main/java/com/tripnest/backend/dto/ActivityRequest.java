package com.tripnest.backend.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class ActivityRequest {
    private String title;
    private String activityType; // SIGHTSEEING, TRANSPORTATION, ACCOMMODATION, DINING, ADVENTURE, SHOPPING, OTHER
    private LocalTime startTime;
    private String location;
    private String notes;
    private Double estimatedCost;
    private Double latitude;
    private Double longitude;
}
