package com.tripnest.backend.service;

import com.tripnest.backend.dto.ExpenseRequest;
import com.tripnest.backend.dto.ExpenseResponse;
import com.tripnest.backend.entity.*;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.exception.UnauthorizedActionException;
import com.tripnest.backend.repository.BudgetRepository;
import com.tripnest.backend.repository.ExpenseRepository;
import com.tripnest.backend.repository.TripRepository;
import com.tripnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Trip findOwnedTrip(User user, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You do not have access to this trip");
        }
        return trip;
    }

    private Expense findExpenseOrThrow(Long expenseId) {
        return expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));
    }

    public ExpenseResponse addExpense(String email, Long tripId, ExpenseRequest request) {
        User user = currentUser(email);
        Trip trip = findOwnedTrip(user, tripId);

        Expense expense = Expense.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .category(request.getCategory() != null
                        ? Expense.ExpenseCategory.valueOf(request.getCategory().toUpperCase())
                        : Expense.ExpenseCategory.MISCELLANEOUS)
                .expenseDate(request.getExpenseDate())
                .trip(trip)
                .paidBy(user)
                .build();

        Expense saved = expenseRepository.save(expense);
        checkBudgetAlert(trip, user);
        return ExpenseResponse.from(saved);
    }

    private void checkBudgetAlert(Trip trip, User user) {
        budgetRepository.findByTripId(trip.getId()).ifPresent(budget -> {
            if (budget.getTotalAmount() == null || budget.getTotalAmount() <= 0) return;
            double spent = expenseRepository.findByTripId(trip.getId())
                    .stream().mapToDouble(Expense::getAmount).sum();
            double ratio = spent / budget.getTotalAmount();
            if (ratio >= 1.0) {
                notificationService.notify(user,
                        "You've exceeded the budget for \"" + trip.getTitle() + "\".",
                        Notification.NotificationType.BUDGET_ALERT);
            } else if (ratio >= 0.9) {
                notificationService.notify(user,
                        "You've used over 90% of the budget for \"" + trip.getTitle() + "\".",
                        Notification.NotificationType.BUDGET_ALERT);
            }
        });
    }

    public List<ExpenseResponse> getExpenses(String email, Long tripId) {
        User user = currentUser(email);
        findOwnedTrip(user, tripId);
        return expenseRepository.findByTripId(tripId)
                .stream().map(ExpenseResponse::from).toList();
    }

    public Map<String, Double> getExpenseSummaryByCategory(String email, Long tripId) {
        User user = currentUser(email);
        findOwnedTrip(user, tripId);
        return expenseRepository.findByTripId(tripId).stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        e -> e.getCategory() != null ? e.getCategory().name() : "MISCELLANEOUS",
                        java.util.stream.Collectors.summingDouble(Expense::getAmount)));
    }

    public ExpenseResponse updateExpense(String email, Long tripId, Long expenseId, ExpenseRequest request) {
        User user = currentUser(email);
        findOwnedTrip(user, tripId);
        Expense expense = findExpenseOrThrow(expenseId);

        if (request.getDescription() != null) expense.setDescription(request.getDescription());
        if (request.getAmount() != null) expense.setAmount(request.getAmount());
        if (request.getCategory() != null) expense.setCategory(Expense.ExpenseCategory.valueOf(request.getCategory().toUpperCase()));
        if (request.getExpenseDate() != null) expense.setExpenseDate(request.getExpenseDate());

        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    public void deleteExpense(String email, Long tripId, Long expenseId) {
        User user = currentUser(email);
        findOwnedTrip(user, tripId);
        Expense expense = findExpenseOrThrow(expenseId);
        expenseRepository.delete(expense);
    }
}
