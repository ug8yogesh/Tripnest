package com.tripnest.backend.service;

import com.tripnest.backend.dto.NotificationResponse;
import com.tripnest.backend.entity.Notification;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.repository.NotificationRepository;
import com.tripnest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /** Internal helper used by other services to raise a notification for a user. */
    public void notify(User user, String message, Notification.NotificationType type) {
        Notification notification = Notification.builder()
                .message(message)
                .notificationType(type)
                .isRead(false)
                .user(user)
                .build();
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return notificationRepository.findByUserId(user.getId())
                .stream().map(NotificationResponse::from).toList();
    }

    public NotificationResponse markAsRead(String email, Long notificationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setIsRead(true);
        return NotificationResponse.from(notificationRepository.save(notification));
    }
}
