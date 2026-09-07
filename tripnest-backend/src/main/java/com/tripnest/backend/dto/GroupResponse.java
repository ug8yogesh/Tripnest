package com.tripnest.backend.dto;

import com.tripnest.backend.entity.TravelGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class GroupResponse {
    private Long id;
    private String name;
    private Long tripId;
    private Long createdById;
    private LocalDateTime createdAt;
    private List<GroupMemberResponse> members;

    public static GroupResponse from(TravelGroup group, List<GroupMemberResponse> members) {
        return new GroupResponse(
                group.getId(),
                group.getName(),
                group.getTrip() != null ? group.getTrip().getId() : null,
                group.getCreatedBy() != null ? group.getCreatedBy().getId() : null,
                group.getCreatedAt(),
                members
        );
    }
}
