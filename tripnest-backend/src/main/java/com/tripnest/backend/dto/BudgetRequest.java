package com.tripnest.backend.dto;

import lombok.Data;

@Data
public class BudgetRequest {
    private Double totalAmount;
    private String currency;
    private Double transportationBudget;
    private Double hotelBudget;
    private Double foodBudget;
    private Double shoppingBudget;
    private Double miscBudget;
}
