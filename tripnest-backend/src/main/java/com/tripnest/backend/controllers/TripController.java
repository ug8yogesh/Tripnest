package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.TripRequest;
import com.tripnest.backend.dto.TripResponse;
import com.tripnest.backend.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(Authentication auth, @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getMyTrips(Authentication auth) {
        return ResponseEntity.ok(tripService.getMyTrips(auth.getName()));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponse> getTrip(Authentication auth, @PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.getTripById(auth.getName(), tripId));
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<TripResponse> updateTrip(Authentication auth, @PathVariable Long tripId,
                                                    @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(auth.getName(), tripId, request));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(Authentication auth, @PathVariable Long tripId) {
        tripService.deleteTrip(auth.getName(), tripId);
        return ResponseEntity.noContent().build();
    }
}
