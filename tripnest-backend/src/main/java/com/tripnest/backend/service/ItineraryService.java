package com.tripnest.backend.service;

import com.tripnest.backend.dto.ActivityResponse;
import com.tripnest.backend.dto.ItineraryRequest;
import com.tripnest.backend.dto.ItineraryResponse;
import com.tripnest.backend.entity.Itinerary;
import com.tripnest.backend.entity.Trip;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.exception.UnauthorizedActionException;
import com.tripnest.backend.repository.ActivityRepository;
import com.tripnest.backend.repository.ItineraryRepository;
import com.tripnest.backend.repository.TripRepository;
import com.tripnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final ActivityRepository activityRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Trip findOwnedTrip(String email, Long tripId) {
        User user = currentUser(email);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You do not have access to this trip");
        }
        return trip;
    }

    private Itinerary findItineraryOrThrow(Long itineraryId) {
        return itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + itineraryId));
    }

    private ItineraryResponse toResponse(Itinerary itinerary) {
        List<ActivityResponse> activities = activityRepository.findByItineraryId(itinerary.getId())
                .stream().map(ActivityResponse::from).toList();
        return ItineraryResponse.from(itinerary, activities);
    }

    public ItineraryResponse addDay(String email, Long tripId, ItineraryRequest request) {
        Trip trip = findOwnedTrip(email, tripId);

        Itinerary itinerary = Itinerary.builder()
                .dayNumber(request.getDayNumber())
                .date(request.getDate())
                .notes(request.getNotes())
                .trip(trip)
                .build();

        return toResponse(itineraryRepository.save(itinerary));
    }

    public List<ItineraryResponse> getTripItinerary(String email, Long tripId) {
        findOwnedTrip(email, tripId);
        return itineraryRepository.findByTripId(tripId)
                .stream().map(this::toResponse).toList();
    }

    public ItineraryResponse updateDay(String email, Long tripId, Long itineraryId, ItineraryRequest request) {
        findOwnedTrip(email, tripId);
        Itinerary itinerary = findItineraryOrThrow(itineraryId);

        if (request.getDayNumber() != null) itinerary.setDayNumber(request.getDayNumber());
        if (request.getDate() != null) itinerary.setDate(request.getDate());
        if (request.getNotes() != null) itinerary.setNotes(request.getNotes());

        return toResponse(itineraryRepository.save(itinerary));
    }

    public void deleteDay(String email, Long tripId, Long itineraryId) {
        findOwnedTrip(email, tripId);
        Itinerary itinerary = findItineraryOrThrow(itineraryId);
        itineraryRepository.delete(itinerary);
    }
}
