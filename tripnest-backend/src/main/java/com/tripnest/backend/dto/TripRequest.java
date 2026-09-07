package com.tripnest.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TripRequest {
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalBudget;
    private String description;
    private String status; // PLANNING, UPCOMING, ONGOING, COMPLETED, CANCELLED
}
