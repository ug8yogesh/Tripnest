package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.ItineraryRequest;
import com.tripnest.backend.dto.ItineraryResponse;
import com.tripnest.backend.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping
    public ResponseEntity<ItineraryResponse> addDay(Authentication auth, @PathVariable Long tripId,
                                                     @RequestBody ItineraryRequest request) {
        return ResponseEntity.ok(itineraryService.addDay(auth.getName(), tripId, request));
    }

    @GetMapping
    public ResponseEntity<List<ItineraryResponse>> getItinerary(Authentication auth, @PathVariable Long tripId) {
        return ResponseEntity.ok(itineraryService.getTripItinerary(auth.getName(), tripId));
    }

    @PutMapping("/{itineraryId}")
    public ResponseEntity<ItineraryResponse> updateDay(Authentication auth, @PathVariable Long tripId,
                                                        @PathVariable Long itineraryId,
                                                        @RequestBody ItineraryRequest request) {
        return ResponseEntity.ok(itineraryService.updateDay(auth.getName(), tripId, itineraryId, request));
    }

    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<Void> deleteDay(Authentication auth, @PathVariable Long tripId,
                                           @PathVariable Long itineraryId) {
        itineraryService.deleteDay(auth.getName(), tripId, itineraryId);
        return ResponseEntity.noContent().build();
    }
}
