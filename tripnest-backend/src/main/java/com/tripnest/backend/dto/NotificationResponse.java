package com.tripnest.backend.dto;

import com.tripnest.backend.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String message;
    private String notificationType;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getMessage(),
                notification.getNotificationType() != null ? notification.getNotificationType().name() : null,
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }
}
