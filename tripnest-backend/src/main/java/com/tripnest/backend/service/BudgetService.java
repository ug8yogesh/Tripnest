package com.tripnest.backend.service;

import com.tripnest.backend.dto.BudgetRequest;
import com.tripnest.backend.dto.BudgetResponse;
import com.tripnest.backend.entity.Budget;
import com.tripnest.backend.entity.Expense;
import com.tripnest.backend.entity.Trip;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.exception.UnauthorizedActionException;
import com.tripnest.backend.repository.BudgetRepository;
import com.tripnest.backend.repository.ExpenseRepository;
import com.tripnest.backend.repository.TripRepository;
import com.tripnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    private Trip findOwnedTrip(String email, Long tripId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You do not have access to this trip");
        }
        return trip;
    }

    private double totalSpent(Long tripId) {
        return expenseRepository.findByTripId(tripId)
                .stream().mapToDouble(Expense::getAmount).sum();
    }

    public BudgetResponse setBudget(String email, Long tripId, BudgetRequest request) {
        Trip trip = findOwnedTrip(email, tripId);

        Budget budget = budgetRepository.findByTripId(tripId).orElseGet(() ->
                Budget.builder().trip(trip).build());

        budget.setTotalAmount(request.getTotalAmount());
        budget.setCurrency(request.getCurrency());
        budget.setTransportationBudget(request.getTransportationBudget());
        budget.setHotelBudget(request.getHotelBudget());
        budget.setFoodBudget(request.getFoodBudget());
        budget.setShoppingBudget(request.getShoppingBudget());
        budget.setMiscBudget(request.getMiscBudget());

        Budget saved = budgetRepository.save(budget);
        return BudgetResponse.from(saved, totalSpent(tripId));
    }

    public BudgetResponse getBudget(String email, Long tripId) {
        findOwnedTrip(email, tripId);
        Budget budget = budgetRepository.findByTripId(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("No budget set for this trip yet"));
        return BudgetResponse.from(budget, totalSpent(tripId));
    }
}
