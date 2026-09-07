package com.tripnest.backend.service;

import com.tripnest.backend.dto.AdminAnalyticsResponse;
import com.tripnest.backend.dto.TravelerAnalyticsResponse;
import com.tripnest.backend.entity.Expense;
import com.tripnest.backend.entity.Trip;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AnalyticsService {
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final DestinationRepository destinationRepository;

    public TravelerAnalyticsResponse traveler(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        List<Trip> trips = tripRepository.findByUserId(user.getId());
        List<Expense> expenses = trips.stream().flatMap(trip -> expenseRepository.findByTripId(trip.getId()).stream()).toList();
        Map<String, Double> summary = expenses.stream().collect(Collectors.groupingBy(
                expense -> expense.getCategory() == null ? "UNCATEGORIZED" : expense.getCategory().name(),
                LinkedHashMap::new, Collectors.summingDouble(expense -> expense.getAmount() == null ? 0 : expense.getAmount())));
        double budget = trips.stream().map(trip -> budgetRepository.findByTripId(trip.getId()).map(b -> b.getTotalAmount()).orElse(trip.getTotalBudget())).filter(java.util.Objects::nonNull).mapToDouble(Double::doubleValue).sum();
        double spent = expenses.stream().map(Expense::getAmount).filter(java.util.Objects::nonNull).mapToDouble(Double::doubleValue).sum();
        long upcoming = trips.stream().filter(trip -> trip.getStartDate() != null && !trip.getStartDate().isBefore(LocalDate.now())).count();
        return new TravelerAnalyticsResponse(upcoming, budget, spent, trips.size(), user.getFavoriteDestinations().stream().map(destination -> destination.getName()).toList(), summary);
    }

    public AdminAnalyticsResponse admin() {
        List<Trip> trips = tripRepository.findAll();
        List<Expense> expenses = expenseRepository.findAll();
        Map<String, Long> popularity = trips.stream().filter(trip -> trip.getDestination() != null).collect(Collectors.groupingBy(Trip::getDestination, LinkedHashMap::new, Collectors.counting()));
        double budget = budgetRepository.findAll().stream().map(b -> b.getTotalAmount()).filter(java.util.Objects::nonNull).mapToDouble(Double::doubleValue).sum();
        double spent = expenses.stream().map(Expense::getAmount).filter(java.util.Objects::nonNull).mapToDouble(Double::doubleValue).sum();
        return new AdminAnalyticsResponse(userRepository.count(), trips.size(), destinationRepository.count(), popularity, budget, spent);
    }
}
