package com.tripnest.backend.service;

import com.tripnest.backend.dto.DestinationRequest;
import com.tripnest.backend.entity.Destination;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("#{systemEnvironment['OPENWEATHER_API_KEY'] ?: ''}")
    private String openWeatherApiKey;

    @Value("#{systemEnvironment['GOOGLE_MAPS_API_KEY'] ?: ''}")
    private String googleMapsApiKey;

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public List<Destination> getPopularDestinations() {
        return destinationRepository.findByIsPopular(true);
    }

    public Destination getDestination(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
        enrich(destination);
        return destination;
    }

    public Destination createDestination(DestinationRequest request) {
        Destination destination = Destination.builder()
                .name(request.getName())
                .country(request.getCountry())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .bestTimeToVisit(request.getBestTimeToVisit())
                .isPopular(request.getIsPopular() != null ? request.getIsPopular() : false)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();
        return destinationRepository.save(destination);
    }

    public Destination updateDestination(Long id, DestinationRequest request) {
        Destination destination = getDestination(id);
        if (request.getName() != null) destination.setName(request.getName());
        if (request.getCountry() != null) destination.setCountry(request.getCountry());
        if (request.getDescription() != null) destination.setDescription(request.getDescription());
        if (request.getImageUrl() != null) destination.setImageUrl(request.getImageUrl());
        if (request.getBestTimeToVisit() != null) destination.setBestTimeToVisit(request.getBestTimeToVisit());
        if (request.getIsPopular() != null) destination.setIsPopular(request.getIsPopular());
        if (request.getLatitude() != null) destination.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) destination.setLongitude(request.getLongitude());
        return destinationRepository.save(destination);
    }

    public void deleteDestination(Long id) {
        destinationRepository.delete(getDestination(id));
    }

    private void enrich(Destination destination) {
        if (destination.getLatitude() != null && destination.getLongitude() != null && googleMapsApiKey != null && !googleMapsApiKey.isBlank()) {
            destination.setStaticMapUrl("https://maps.googleapis.com/maps/api/staticmap?center=" + destination.getLatitude() + "," + destination.getLongitude() + "&zoom=12&size=800x400&markers=color:red%7C" + destination.getLatitude() + "," + destination.getLongitude() + "&key=" + googleMapsApiKey);
        }
        if (openWeatherApiKey == null || openWeatherApiKey.isBlank()) return;
        try {
            String location = java.net.URLEncoder.encode(destination.getName() + "," + destination.getCountry(), java.nio.charset.StandardCharsets.UTF_8);
            HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + openWeatherApiKey + "&units=metric")).GET().build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode json = objectMapper.readTree(response.body());
                destination.setWeather(java.util.Map.of("temperature", json.path("main").path("temp").asDouble(), "description", json.path("weather").path(0).path("description").asText(), "humidity", json.path("main").path("humidity").asInt()));
            }
        } catch (Exception ignored) {
            // Weather is an optional enrichment and must not break destination reads.
        }
    }
}
