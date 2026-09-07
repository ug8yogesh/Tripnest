package com.tripnest.backend.dto;

import com.tripnest.backend.entity.GroupMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class GroupMessageResponse {
    private Long id;
    private String content;
    private Long senderId;
    private String senderName;
    private LocalDateTime sentAt;

    public static GroupMessageResponse from(GroupMessage message) {
        return new GroupMessageResponse(
                message.getId(),
                message.getContent(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getSentAt()
        );
    }
}
