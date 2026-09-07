package com.tripnest.backend.service;

import com.tripnest.backend.dto.ActivityRequest;
import com.tripnest.backend.dto.ActivityResponse;
import com.tripnest.backend.entity.Activity;
import com.tripnest.backend.entity.Itinerary;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.exception.UnauthorizedActionException;
import com.tripnest.backend.repository.ActivityRepository;
import com.tripnest.backend.repository.ItineraryRepository;
import com.tripnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ItineraryRepository itineraryRepository;
    private final UserRepository userRepository;

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Itinerary findOwnedItinerary(String email, Long itineraryId) {
        User user = currentUser(email);
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + itineraryId));
        if (!itinerary.getTrip().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You do not have access to this itinerary");
        }
        return itinerary;
    }

    private Activity findActivityOrThrow(Long activityId) {
        return activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));
    }

    public ActivityResponse addActivity(String email, Long itineraryId, ActivityRequest request) {
        Itinerary itinerary = findOwnedItinerary(email, itineraryId);

        Activity activity = Activity.builder()
                .title(request.getTitle())
                .activityType(request.getActivityType() != null
                        ? Activity.ActivityType.valueOf(request.getActivityType().toUpperCase())
                        : Activity.ActivityType.OTHER)
                .startTime(request.getStartTime())
                .location(request.getLocation())
                .notes(request.getNotes())
                .estimatedCost(request.getEstimatedCost())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .itinerary(itinerary)
                .build();

        return ActivityResponse.from(activityRepository.save(activity));
    }

    public List<ActivityResponse> getActivities(String email, Long itineraryId) {
        findOwnedItinerary(email, itineraryId);
        return activityRepository.findByItineraryId(itineraryId)
                .stream().map(ActivityResponse::from).toList();
    }

    public ActivityResponse updateActivity(String email, Long itineraryId, Long activityId, ActivityRequest request) {
        findOwnedItinerary(email, itineraryId);
        Activity activity = findActivityOrThrow(activityId);

        if (request.getTitle() != null) activity.setTitle(request.getTitle());
        if (request.getActivityType() != null) activity.setActivityType(Activity.ActivityType.valueOf(request.getActivityType().toUpperCase()));
        if (request.getStartTime() != null) activity.setStartTime(request.getStartTime());
        if (request.getLocation() != null) activity.setLocation(request.getLocation());
        if (request.getNotes() != null) activity.setNotes(request.getNotes());
        if (request.getEstimatedCost() != null) activity.setEstimatedCost(request.getEstimatedCost());
        if (request.getLatitude() != null) activity.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) activity.setLongitude(request.getLongitude());

        return ActivityResponse.from(activityRepository.save(activity));
    }

    public void deleteActivity(String email, Long itineraryId, Long activityId) {
        findOwnedItinerary(email, itineraryId);
        Activity activity = findActivityOrThrow(activityId);
        activityRepository.delete(activity);
    }
}
