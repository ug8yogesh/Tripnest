package com.tripnest.backend.dto;

import com.tripnest.backend.entity.Itinerary;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class ItineraryResponse {
    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private String notes;
    private Long tripId;
    private List<ActivityResponse> activities;

    public static ItineraryResponse from(Itinerary itinerary, List<ActivityResponse> activities) {
        return new ItineraryResponse(
                itinerary.getId(),
                itinerary.getDayNumber(),
                itinerary.getDate(),
                itinerary.getNotes(),
                itinerary.getTrip() != null ? itinerary.getTrip().getId() : null,
                activities
        );
    }
}
