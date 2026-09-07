package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.BudgetRequest;
import com.tripnest.backend.dto.BudgetResponse;
import com.tripnest.backend.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips/{tripId}/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PutMapping
    public ResponseEntity<BudgetResponse> setBudget(Authentication auth, @PathVariable Long tripId,
                                                     @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.setBudget(auth.getName(), tripId, request));
    }

    @GetMapping
    public ResponseEntity<BudgetResponse> getBudget(Authentication auth, @PathVariable Long tripId) {
        return ResponseEntity.ok(budgetService.getBudget(auth.getName(), tripId));
    }
}
