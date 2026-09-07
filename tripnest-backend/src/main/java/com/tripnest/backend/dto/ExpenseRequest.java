package com.tripnest.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExpenseRequest {
    private String description;
    private Double amount;
    private String category; // TRANSPORTATION, HOTEL, FOOD, SHOPPING, ENTERTAINMENT, MISCELLANEOUS
    private LocalDate expenseDate;
}
