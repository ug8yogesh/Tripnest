package com.tripnest.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Map;

@Data @AllArgsConstructor
public class AdminAnalyticsResponse {
    private long userCount;
    private long tripCount;
    private long destinationCount;
    private Map<String, Long> destinationPopularity;
    private double platformBudget;
    private double platformSpend;
}
