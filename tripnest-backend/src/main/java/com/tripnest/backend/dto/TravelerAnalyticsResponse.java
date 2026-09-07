package com.tripnest.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data @AllArgsConstructor
public class TravelerAnalyticsResponse {
    private long upcomingTripsCount;
    private double totalBudget;
    private double totalSpent;
    private long totalTrips;
    private List<String> favoriteDestinations;
    private Map<String, Double> expenseSummary;
}
