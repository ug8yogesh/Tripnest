package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.AdminAnalyticsResponse;
import com.tripnest.backend.dto.TravelerAnalyticsResponse;
import com.tripnest.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<TravelerAnalyticsResponse> traveler(Authentication auth) {
        return ResponseEntity.ok(analyticsService.traveler(auth.getName()));
    }

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminAnalyticsResponse> admin() {
        return ResponseEntity.ok(analyticsService.admin());
    }
}
