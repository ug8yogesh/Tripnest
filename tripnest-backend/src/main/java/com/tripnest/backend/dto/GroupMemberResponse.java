package com.tripnest.backend.dto;

import com.tripnest.backend.entity.GroupMember;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GroupMemberResponse {
    private Long userId;
    private String name;
    private String email;
    private String groupRole;

    public static GroupMemberResponse from(GroupMember member) {
        return new GroupMemberResponse(
                member.getUser().getId(),
                member.getUser().getName(),
                member.getUser().getEmail(),
                member.getGroupRole().name()
        );
    }
}
