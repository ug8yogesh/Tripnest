package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.ExpenseRequest;
import com.tripnest.backend.dto.ExpenseResponse;
import com.tripnest.backend.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(Authentication auth, @PathVariable Long tripId,
                                                       @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.addExpense(auth.getName(), tripId, request));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses(Authentication auth, @PathVariable Long tripId) {
        return ResponseEntity.ok(expenseService.getExpenses(auth.getName(), tripId));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Double>> getSummary(Authentication auth, @PathVariable Long tripId) {
        return ResponseEntity.ok(expenseService.getExpenseSummaryByCategory(auth.getName(), tripId));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(Authentication auth, @PathVariable Long tripId,
                                                          @PathVariable Long expenseId,
                                                          @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(auth.getName(), tripId, expenseId, request));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(Authentication auth, @PathVariable Long tripId,
                                               @PathVariable Long expenseId) {
        expenseService.deleteExpense(auth.getName(), tripId, expenseId);
        return ResponseEntity.noContent().build();
    }
}
