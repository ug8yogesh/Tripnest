package com.tripnest.backend.dto;

import com.tripnest.backend.entity.Activity;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ActivityResponse {
    private Long id;
    private String title;
    private String activityType;
    private LocalTime startTime;
    private String location;
    private String notes;
    private Double estimatedCost;
    private Long itineraryId;
    private Double latitude;
    private Double longitude;

    public static ActivityResponse from(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getTitle(),
                activity.getActivityType() != null ? activity.getActivityType().name() : null,
                activity.getStartTime(),
                activity.getLocation(),
                activity.getNotes(),
                activity.getEstimatedCost(),
                activity.getItinerary() != null ? activity.getItinerary().getId() : null,
                activity.getLatitude(),
                activity.getLongitude()
        );
    }
}
