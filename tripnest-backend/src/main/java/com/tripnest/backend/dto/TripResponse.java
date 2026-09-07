package com.tripnest.backend.dto;

import com.tripnest.backend.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TripResponse {
    private Long id;
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalBudget;
    private String description;
    private String status;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;

    public static TripResponse from(Trip trip) {
        return new TripResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getDestination(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getTotalBudget(),
                trip.getDescription(),
                trip.getStatus() != null ? trip.getStatus().name() : null,
                trip.getUser() != null ? trip.getUser().getId() : null,
                trip.getUser() != null ? trip.getUser().getName() : null,
                trip.getCreatedAt()
        );
    }
}
