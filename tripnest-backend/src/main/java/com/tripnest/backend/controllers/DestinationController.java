package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.DestinationRequest;
import com.tripnest.backend.entity.Destination;
import com.tripnest.backend.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    @GetMapping
    public ResponseEntity<List<Destination>> getAll() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Destination>> getPopular() {
        return ResponseEntity.ok(destinationService.getPopularDestinations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(destinationService.getDestination(id));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Destination> create(@RequestBody DestinationRequest request) {
        return ResponseEntity.ok(destinationService.createDestination(request));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Destination> update(@PathVariable Long id, @RequestBody DestinationRequest request) {
        return ResponseEntity.ok(destinationService.updateDestination(id, request));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }
}
