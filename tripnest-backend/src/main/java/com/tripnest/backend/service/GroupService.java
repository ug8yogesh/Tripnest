package com.tripnest.backend.service;

import com.tripnest.backend.dto.*;
import com.tripnest.backend.entity.*;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.exception.UnauthorizedActionException;
import com.tripnest.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final TravelGroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final NotificationService notificationService;

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private TravelGroup findGroupOrThrow(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));
    }

    private void assertMember(Long groupId, Long userId) {
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new UnauthorizedActionException("You are not a member of this group");
        }
    }

    private GroupMember.GroupRole roleOf(Long groupId, Long userId) {
        return groupMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .map(GroupMember::getGroupRole)
                .orElseThrow(() -> new UnauthorizedActionException("You are not a member of this group"));
    }

    private GroupResponse toResponse(TravelGroup group) {
        List<GroupMemberResponse> members = groupMemberRepository.findByGroupId(group.getId())
                .stream().map(GroupMemberResponse::from).toList();
        return GroupResponse.from(group, members);
    }

    public GroupResponse createGroup(String email, GroupRequest request) {
        User user = currentUser(email);
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.getTripId()));

        if (!trip.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("Only the trip owner can create a group for it");
        }

        TravelGroup group = TravelGroup.builder()
                .name(request.getName())
                .trip(trip)
                .createdBy(user)
                .build();
        group = groupRepository.save(group);

        GroupMember owner = GroupMember.builder()
                .group(group)
                .user(user)
                .groupRole(GroupMember.GroupRole.GROUP_ADMIN)
                .build();
        groupMemberRepository.save(owner);

        return toResponse(group);
    }

    public List<GroupResponse> getMyGroups(String email) {
        User user = currentUser(email);
        return groupMemberRepository.findByUserId(user.getId()).stream()
                .map(GroupMember::getGroup)
                .distinct()
                .map(this::toResponse)
                .toList();
    }

    public GroupResponse getGroup(String email, Long groupId) {
        User user = currentUser(email);
        assertMember(groupId, user.getId());
        return toResponse(findGroupOrThrow(groupId));
    }

    public GroupResponse inviteMember(String email, Long groupId, InviteMemberRequest request) {
        User user = currentUser(email);
        if (roleOf(groupId, user.getId()) != GroupMember.GroupRole.GROUP_ADMIN) {
            throw new UnauthorizedActionException("Only a group admin can invite members");
        }

        TravelGroup group = findGroupOrThrow(groupId);
        User invitee = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + request.getEmail()));

        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, invitee.getId())) {
            throw new UnauthorizedActionException("User is already a member of this group");
        }

        GroupMember member = GroupMember.builder()
                .group(group)
                .user(invitee)
                .groupRole(GroupMember.GroupRole.MEMBER)
                .build();
        groupMemberRepository.save(member);

        notificationService.notify(invitee,
                user.getName() + " added you to the group \"" + group.getName() + "\".",
                Notification.NotificationType.GROUP_INVITATION);

        return toResponse(group);
    }

    public void removeMember(String email, Long groupId, Long userId) {
        User user = currentUser(email);
        if (roleOf(groupId, user.getId()) != GroupMember.GroupRole.GROUP_ADMIN) {
            throw new UnauthorizedActionException("Only a group admin can remove members");
        }
        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in this group"));
        groupMemberRepository.delete(member);
    }

    public GroupMessageResponse postMessage(String email, Long groupId, GroupMessageRequest request) {
        User user = currentUser(email);
        assertMember(groupId, user.getId());
        TravelGroup group = findGroupOrThrow(groupId);

        GroupMessage message = GroupMessage.builder()
                .group(group)
                .sender(user)
                .content(request.getContent())
                .build();

        return GroupMessageResponse.from(groupMessageRepository.save(message));
    }

    public List<GroupMessageResponse> getMessages(String email, Long groupId) {
        User user = currentUser(email);
        assertMember(groupId, user.getId());
        return groupMessageRepository.findByGroupIdOrderBySentAtAsc(groupId)
                .stream().map(GroupMessageResponse::from).toList();
    }

    /** Even-split settlement: how much each member owes/is owed based on what they paid for the trip. */
    public Map<String, Double> getSettlement(String email, Long groupId) {
        User user = currentUser(email);
        assertMember(groupId, user.getId());
        TravelGroup group = findGroupOrThrow(groupId);

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        if (members.isEmpty() || group.getTrip() == null) return Map.of();

        List<Expense> expenses = expenseRepository.findByTripId(group.getTrip().getId());
        double total = expenses.stream().mapToDouble(Expense::getAmount).sum();
        double fairShare = total / members.size();

        Map<String, Double> paidByMember = new LinkedHashMap<>();
        for (GroupMember m : members) {
            paidByMember.put(m.getUser().getEmail(), 0.0);
        }
        for (Expense e : expenses) {
            if (e.getPaidBy() != null) {
                paidByMember.merge(e.getPaidBy().getEmail(), e.getAmount(), Double::sum);
            }
        }

        Map<String, Double> balances = new LinkedHashMap<>();
        paidByMember.forEach((memberEmail, paid) -> balances.put(memberEmail, paid - fairShare));
        return balances; // positive = should be reimbursed, negative = owes the group
    }
}
