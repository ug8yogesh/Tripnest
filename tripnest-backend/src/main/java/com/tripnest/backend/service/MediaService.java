package com.tripnest.backend.service;

import com.tripnest.backend.dto.MediaResponse;
import com.tripnest.backend.entity.Media;
import com.tripnest.backend.entity.Trip;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.exception.UnauthorizedActionException;
import com.tripnest.backend.repository.MediaRepository;
import com.tripnest.backend.repository.TripRepository;
import com.tripnest.backend.repository.UserRepository;
import com.tripnest.backend.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service @RequiredArgsConstructor
public class MediaService {
    private final MediaRepository mediaRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    public MediaResponse upload(String email, Long tripId, String mediaType, MultipartFile file, String baseUrl) {
        User user = currentUser(email); Trip trip = findTrip(tripId); assertOwner(trip, user);
        if (file.isEmpty()) throw new IllegalArgumentException("File must not be empty");
        try {
            Media media = Media.builder().originalFilename(file.getOriginalFilename()).storedFilename(storageService.store(file))
                    .contentType(file.getContentType()).size(file.getSize()).mediaType(mediaType == null || mediaType.isBlank() ? "DOCUMENT" : mediaType.toUpperCase())
                    .storagePath(file.getOriginalFilename()).trip(trip).user(user).build();
            return toResponse(mediaRepository.save(media), baseUrl);
        } catch (IOException ex) { throw new IllegalStateException("Unable to store uploaded file", ex); }
    }

    public List<MediaResponse> list(String email, Long tripId, String baseUrl) {
        User user = currentUser(email); Trip trip = findTrip(tripId); assertOwner(trip, user);
        return mediaRepository.findByTripIdOrderByCreatedAtDesc(tripId).stream().map(media -> toResponse(media, baseUrl)).toList();
    }

    public Media findMedia(String email, Long mediaId) {
        Media media = mediaRepository.findById(mediaId).orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));
        assertOwner(media.getTrip(), currentUser(email)); return media;
    }

    public Resource load(String email, Long mediaId) { return storageService.load(findMedia(email, mediaId).getStoredFilename()); }

    public void delete(String email, Long mediaId) {
        Media media = findMedia(email, mediaId);
        try { storageService.delete(media.getStoredFilename()); mediaRepository.delete(media); }
        catch (IOException ex) { throw new IllegalStateException("Unable to delete stored file", ex); }
    }

    private MediaResponse toResponse(Media media, String baseUrl) { return MediaResponse.from(media, baseUrl + "/api/media/" + media.getId() + "/file"); }
    private User currentUser(String email) { return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found: " + email)); }
    private Trip findTrip(Long tripId) { return tripRepository.findById(tripId).orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId)); }
    private void assertOwner(Trip trip, User user) { if (trip.getUser() == null || !trip.getUser().getId().equals(user.getId())) throw new UnauthorizedActionException("You do not have access to this trip"); }
}
