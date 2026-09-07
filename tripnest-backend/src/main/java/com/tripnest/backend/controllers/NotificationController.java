package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.NotificationResponse;
import com.tripnest.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication auth) {
        return ResponseEntity.ok(notificationService.getMyNotifications(auth.getName()));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(Authentication auth, @PathVariable Long notificationId) {
        return ResponseEntity.ok(notificationService.markAsRead(auth.getName(), notificationId));
    }
}
