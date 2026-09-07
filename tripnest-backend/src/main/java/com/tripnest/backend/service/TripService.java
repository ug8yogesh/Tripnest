package com.tripnest.backend.service;

import com.tripnest.backend.dto.TripRequest;
import com.tripnest.backend.dto.TripResponse;
import com.tripnest.backend.entity.Trip;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.exception.UnauthorizedActionException;
import com.tripnest.backend.repository.TripRepository;
import com.tripnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Trip findTripOrThrow(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
    }

    private void assertOwner(Trip trip, User user) {
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You do not have access to this trip");
        }
    }

    public TripResponse createTrip(String email, TripRequest request) {
        User user = currentUser(email);

        Trip trip = Trip.builder()
                .title(request.getTitle())
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalBudget(request.getTotalBudget())
                .description(request.getDescription())
                .status(request.getStatus() != null
                        ? Trip.TripStatus.valueOf(request.getStatus().toUpperCase())
                        : Trip.TripStatus.PLANNING)
                .user(user)
                .build();

        return TripResponse.from(tripRepository.save(trip));
    }

    public List<TripResponse> getMyTrips(String email) {
        User user = currentUser(email);
        return tripRepository.findByUserId(user.getId())
                .stream().map(TripResponse::from).toList();
    }

    public TripResponse getTripById(String email, Long tripId) {
        User user = currentUser(email);
        Trip trip = findTripOrThrow(tripId);
        assertOwner(trip, user);
        return TripResponse.from(trip);
    }

    public TripResponse updateTrip(String email, Long tripId, TripRequest request) {
        User user = currentUser(email);
        Trip trip = findTripOrThrow(tripId);
        assertOwner(trip, user);

        if (request.getTitle() != null) trip.setTitle(request.getTitle());
        if (request.getDestination() != null) trip.setDestination(request.getDestination());
        if (request.getStartDate() != null) trip.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) trip.setEndDate(request.getEndDate());
        if (request.getTotalBudget() != null) trip.setTotalBudget(request.getTotalBudget());
        if (request.getDescription() != null) trip.setDescription(request.getDescription());
        if (request.getStatus() != null) trip.setStatus(Trip.TripStatus.valueOf(request.getStatus().toUpperCase()));

        return TripResponse.from(tripRepository.save(trip));
    }

    public void deleteTrip(String email, Long tripId) {
        User user = currentUser(email);
        Trip trip = findTripOrThrow(tripId);
        assertOwner(trip, user);
        tripRepository.delete(trip);
    }
}
