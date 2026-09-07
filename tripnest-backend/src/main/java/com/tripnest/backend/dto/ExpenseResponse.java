package com.tripnest.backend.dto;

import com.tripnest.backend.entity.Expense;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String description;
    private Double amount;
    private String category;
    private LocalDate expenseDate;
    private Long tripId;
    private Long paidById;
    private String paidByName;
    private LocalDateTime createdAt;

    public static ExpenseResponse from(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory() != null ? expense.getCategory().name() : null,
                expense.getExpenseDate(),
                expense.getTrip() != null ? expense.getTrip().getId() : null,
                expense.getPaidBy() != null ? expense.getPaidBy().getId() : null,
                expense.getPaidBy() != null ? expense.getPaidBy().getName() : null,
                expense.getCreatedAt()
        );
    }
}
