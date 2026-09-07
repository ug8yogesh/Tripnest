package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.ActivityRequest;
import com.tripnest.backend.dto.ActivityResponse;
import com.tripnest.backend.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itineraries/{itineraryId}/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> addActivity(Authentication auth, @PathVariable Long itineraryId,
                                                          @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.addActivity(auth.getName(), itineraryId, request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getActivities(Authentication auth, @PathVariable Long itineraryId) {
        return ResponseEntity.ok(activityService.getActivities(auth.getName(), itineraryId));
    }

    @PutMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> updateActivity(Authentication auth, @PathVariable Long itineraryId,
                                                             @PathVariable Long activityId,
                                                             @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.updateActivity(auth.getName(), itineraryId, activityId, request));
    }

    @DeleteMapping("/{activityId}")
    public ResponseEntity<Void> deleteActivity(Authentication auth, @PathVariable Long itineraryId,
                                                @PathVariable Long activityId) {
        activityService.deleteActivity(auth.getName(), itineraryId, activityId);
        return ResponseEntity.noContent().build();
    }
}
