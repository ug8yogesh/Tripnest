package com.tripnest.backend.controllers;

import com.tripnest.backend.dto.*;
import com.tripnest.backend.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(Authentication auth, @RequestBody GroupRequest request) {
        return ResponseEntity.ok(groupService.createGroup(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<GroupResponse>> getMyGroups(Authentication auth) {
        return ResponseEntity.ok(groupService.getMyGroups(auth.getName()));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupResponse> getGroup(Authentication auth, @PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroup(auth.getName(), groupId));
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<GroupResponse> inviteMember(Authentication auth, @PathVariable Long groupId,
                                                       @RequestBody InviteMemberRequest request) {
        return ResponseEntity.ok(groupService.inviteMember(auth.getName(), groupId, request));
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Void> removeMember(Authentication auth, @PathVariable Long groupId,
                                              @PathVariable Long userId) {
        groupService.removeMember(auth.getName(), groupId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<GroupMessageResponse> postMessage(Authentication auth, @PathVariable Long groupId,
                                                             @RequestBody GroupMessageRequest request) {
        return ResponseEntity.ok(groupService.postMessage(auth.getName(), groupId, request));
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<GroupMessageResponse>> getMessages(Authentication auth, @PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getMessages(auth.getName(), groupId));
    }

    @GetMapping("/{groupId}/settlement")
    public ResponseEntity<Map<String, Double>> getSettlement(Authentication auth, @PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getSettlement(auth.getName(), groupId));
    }
}
