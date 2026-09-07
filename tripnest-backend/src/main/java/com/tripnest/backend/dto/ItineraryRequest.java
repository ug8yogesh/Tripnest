package com.tripnest.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ItineraryRequest {
    private Integer dayNumber;
    private LocalDate date;
    private String notes;
}
