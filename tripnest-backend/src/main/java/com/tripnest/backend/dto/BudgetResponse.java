package com.tripnest.backend.dto;

import com.tripnest.backend.entity.Budget;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private Double totalAmount;
    private String currency;
    private Double transportationBudget;
    private Double hotelBudget;
    private Double foodBudget;
    private Double shoppingBudget;
    private Double miscBudget;
    private Double totalSpent;
    private Double remaining;
    private Long tripId;

    public static BudgetResponse from(Budget budget, Double totalSpent) {
        double remaining = (budget.getTotalAmount() != null ? budget.getTotalAmount() : 0) - totalSpent;
        return new BudgetResponse(
                budget.getId(),
                budget.getTotalAmount(),
                budget.getCurrency(),
                budget.getTransportationBudget(),
                budget.getHotelBudget(),
                budget.getFoodBudget(),
                budget.getShoppingBudget(),
                budget.getMiscBudget(),
                totalSpent,
                remaining,
                budget.getTrip() != null ? budget.getTrip().getId() : null
        );
    }
}
