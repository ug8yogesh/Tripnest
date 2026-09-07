package com.tripnest.backend;

import com.tripnest.backend.dto.*;
import com.tripnest.backend.entity.*;
import com.tripnest.backend.exception.ResourceNotFoundException;
import com.tripnest.backend.exception.UnauthorizedActionException;
import com.tripnest.backend.repository.*;
import com.tripnest.backend.service.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceUnitTests {

    @Mock TripRepository tripRepository;
    @Mock UserRepository userRepository;
    @InjectMocks TripService tripService;

    @Test void tripCreateReadUpdateDelete() {
        User owner = user(1L, "owner@test.com"); Trip trip = trip(10L, owner); TripRequest request = tripRequest();
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> { Trip value = invocation.getArgument(0); if (value.getId() == null) value.setId(10L); return value; });
        when(tripRepository.findById(10L)).thenReturn(Optional.of(trip));
        assertEquals(10L, tripService.createTrip(owner.getEmail(), request).getId());
        assertNotNull(tripService.getTripById(owner.getEmail(), 10L));
        tripService.updateTrip(owner.getEmail(), 10L, request);
        tripService.deleteTrip(owner.getEmail(), 10L);
        verify(tripRepository).delete(trip);
    }

    @Test void tripRejectsNonOwner() {
        User owner = user(1L, "owner@test.com"); User other = user(2L, "other@test.com");
        when(userRepository.findByEmail(other.getEmail())).thenReturn(Optional.of(other));
        when(tripRepository.findById(10L)).thenReturn(Optional.of(trip(10L, owner)));
        assertThrows(UnauthorizedActionException.class, () -> tripService.getTripById(other.getEmail(), 10L));
    }

    @Mock ItineraryRepository itineraryRepository;
    @Mock ActivityRepository activityRepository;
    @InjectMocks ItineraryService itineraryService;

    @Test void itineraryCreateReadUpdateDelete() {
        User owner = user(1L, "owner@test.com"); Trip trip = trip(10L, owner); Itinerary day = Itinerary.builder().id(5L).trip(trip).dayNumber(1).date(LocalDate.now()).build();
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner)); when(tripRepository.findById(10L)).thenReturn(Optional.of(trip));
        when(itineraryRepository.save(any())).thenReturn(day); when(itineraryRepository.findById(5L)).thenReturn(Optional.of(day)); when(activityRepository.findByItineraryId(5L)).thenReturn(List.of());
        ItineraryRequest request = new ItineraryRequest(); request.setDayNumber(1); request.setDate(LocalDate.now());
        assertNotNull(itineraryService.addDay(owner.getEmail(), 10L, request)); assertNotNull(itineraryService.getTripItinerary(owner.getEmail(), 10L));
        assertNotNull(itineraryService.updateDay(owner.getEmail(), 10L, 5L, request)); itineraryService.deleteDay(owner.getEmail(), 10L, 5L); verify(itineraryRepository).delete(day);
    }

    @Test void itineraryRejectsNonOwner() {
        User owner = user(1L, "owner@test.com"); User other = user(2L, "other@test.com"); Trip trip = trip(10L, owner);
        when(userRepository.findByEmail(other.getEmail())).thenReturn(Optional.of(other)); when(tripRepository.findById(10L)).thenReturn(Optional.of(trip));
        assertThrows(UnauthorizedActionException.class, () -> itineraryService.getTripItinerary(other.getEmail(), 10L));
    }

    @Mock BudgetRepository budgetRepository;
    @Mock ExpenseRepository expenseRepository;
    @InjectMocks BudgetService budgetService;

    @Test void budgetSetAndRead() {
        User owner = user(1L, "owner@test.com"); Trip trip = trip(10L, owner); Budget budget = Budget.builder().id(3L).trip(trip).totalAmount(1000D).currency("USD").build();
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner)); when(tripRepository.findById(10L)).thenReturn(Optional.of(trip)); when(budgetRepository.findByTripId(10L)).thenReturn(Optional.of(budget)); when(budgetRepository.save(any())).thenReturn(budget); when(expenseRepository.findByTripId(10L)).thenReturn(List.of());
        BudgetRequest request = new BudgetRequest(); request.setTotalAmount(1000D); request.setCurrency("USD");
        assertEquals(3L, budgetService.setBudget(owner.getEmail(), 10L, request).getId()); assertNotNull(budgetService.getBudget(owner.getEmail(), 10L));
    }

    @Test void budgetRejectsNonOwner() {
        User owner = user(1L, "owner@test.com"); User other = user(2L, "other@test.com"); when(userRepository.findByEmail(other.getEmail())).thenReturn(Optional.of(other)); when(tripRepository.findById(10L)).thenReturn(Optional.of(trip(10L, owner)));
        assertThrows(UnauthorizedActionException.class, () -> budgetService.getBudget(other.getEmail(), 10L));
    }

    @Mock NotificationRepository notificationRepository;
    @InjectMocks NotificationService notificationService;
    @InjectMocks ExpenseService expenseService;

    @Test void expenseCreateReadUpdateDelete() {
        User owner = user(1L, "owner@test.com"); Trip trip = trip(10L, owner); Expense expense = Expense.builder().id(8L).trip(trip).paidBy(owner).description("train").amount(50D).category(Expense.ExpenseCategory.TRANSPORTATION).build();
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner)); when(tripRepository.findById(10L)).thenReturn(Optional.of(trip)); when(expenseRepository.save(any())).thenReturn(expense); when(expenseRepository.findById(8L)).thenReturn(Optional.of(expense)); when(expenseRepository.findByTripId(10L)).thenReturn(List.of(expense)); when(budgetRepository.findByTripId(10L)).thenReturn(Optional.empty());
        ExpenseRequest request = new ExpenseRequest(); request.setDescription("train"); request.setAmount(50D); request.setCategory("TRANSPORTATION"); request.setExpenseDate(LocalDate.now());
        assertEquals(8L, expenseService.addExpense(owner.getEmail(), 10L, request).getId()); assertEquals(1, expenseService.getExpenses(owner.getEmail(), 10L).size()); assertEquals(50D, expenseService.getExpenseSummaryByCategory(owner.getEmail(), 10L).get("TRANSPORTATION")); assertNotNull(expenseService.updateExpense(owner.getEmail(), 10L, 8L, request)); expenseService.deleteExpense(owner.getEmail(), 10L, 8L); verify(expenseRepository).delete(expense);
    }

    @Test void expenseRejectsNonOwner() {
        User owner = user(1L, "owner@test.com"); User other = user(2L, "other@test.com"); when(userRepository.findByEmail(other.getEmail())).thenReturn(Optional.of(other)); when(tripRepository.findById(10L)).thenReturn(Optional.of(trip(10L, owner)));
        assertThrows(UnauthorizedActionException.class, () -> expenseService.getExpenses(other.getEmail(), 10L));
    }

    @Mock TravelGroupRepository groupRepository;
    @Mock GroupMemberRepository groupMemberRepository;
    @Mock GroupMessageRepository groupMessageRepository;
    @InjectMocks GroupService groupService;

    @Test void groupCreateAndMemberRemoval() {
        User owner = user(1L, "owner@test.com"); Trip trip = trip(10L, owner); TravelGroup group = TravelGroup.builder().id(4L).name("crew").trip(trip).createdBy(owner).build(); GroupMember member = GroupMember.builder().group(group).user(owner).groupRole(GroupMember.GroupRole.GROUP_ADMIN).build();
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner)); when(tripRepository.findById(10L)).thenReturn(Optional.of(trip)); when(groupRepository.save(any())).thenReturn(group); when(groupMemberRepository.findByGroupId(4L)).thenReturn(List.of(member)); when(groupMemberRepository.findByGroupIdAndUserId(4L, 1L)).thenReturn(Optional.of(member));
        GroupRequest request = new GroupRequest(); request.setName("crew"); request.setTripId(10L); assertNotNull(groupService.createGroup(owner.getEmail(), request)); groupService.removeMember(owner.getEmail(), 4L, 1L); verify(groupMemberRepository).delete(member);
    }

    @Test void groupRejectsNonAdminInvite() {
        User memberUser = user(2L, "member@test.com"); GroupMember member = GroupMember.builder().user(memberUser).groupRole(GroupMember.GroupRole.MEMBER).build(); when(userRepository.findByEmail(memberUser.getEmail())).thenReturn(Optional.of(memberUser)); when(groupMemberRepository.findByGroupIdAndUserId(4L, 2L)).thenReturn(Optional.of(member));
        assertThrows(UnauthorizedActionException.class, () -> groupService.inviteMember(memberUser.getEmail(), 4L, new InviteMemberRequest()));
    }

    @Mock DestinationRepository destinationRepository;
    @InjectMocks DestinationService destinationService;

    @Test void destinationCreateReadUpdateDelete() {
        Destination destination = Destination.builder().id(7L).name("Goa").country("India").build(); when(destinationRepository.save(any())).thenReturn(destination); when(destinationRepository.findById(7L)).thenReturn(Optional.of(destination));
        DestinationRequest request = new DestinationRequest(); request.setName("Goa"); request.setCountry("India"); assertEquals(7L, destinationService.createDestination(request).getId()); assertNotNull(destinationService.getDestination(7L)); assertNotNull(destinationService.updateDestination(7L, request)); destinationService.deleteDestination(7L); verify(destinationRepository).delete(destination);
    }

    @Test void destinationReadRejectsMissing() { when(destinationRepository.findById(99L)).thenReturn(Optional.empty()); assertThrows(ResourceNotFoundException.class, () -> destinationService.getDestination(99L)); }

    @Test void notificationCreateReadMark() {
        User user = user(1L, "owner@test.com"); Notification notification = Notification.builder().id(2L).user(user).message("hello").notificationType(Notification.NotificationType.SYSTEM).isRead(false).build();
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user)); when(notificationRepository.save(any())).thenReturn(notification); when(notificationRepository.findByUserId(1L)).thenReturn(List.of(notification)); when(notificationRepository.findById(2L)).thenReturn(Optional.of(notification));
        notificationService.notify(user, "hello", Notification.NotificationType.SYSTEM); assertEquals(1, notificationService.getMyNotifications(user.getEmail()).size()); assertTrue(notificationService.markAsRead(user.getEmail(), 2L).getIsRead());
    }

    @Test void notificationRejectsOtherUser() {
        User owner = user(1L, "owner@test.com"); User other = user(2L, "other@test.com"); Notification notification = Notification.builder().id(2L).user(owner).build(); when(userRepository.findByEmail(other.getEmail())).thenReturn(Optional.of(other)); when(notificationRepository.findById(2L)).thenReturn(Optional.of(notification));
        assertThrows(ResourceNotFoundException.class, () -> notificationService.markAsRead(other.getEmail(), 2L));
    }

    @Test void profileReadAndUpdate() {
        User user = user(1L, "owner@test.com"); Destination destination = Destination.builder().id(5L).name("Goa").country("India").build(); user.setFavoriteDestinations(new HashSet<>(Set.of(destination))); UpdateProfileRequest request = new UpdateProfileRequest(); request.setName("Updated"); request.setFavoriteDestinationIds(List.of(5L));
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user)); when(destinationRepository.findAllById(List.of(5L))).thenReturn(List.of(destination)); when(userRepository.save(user)).thenReturn(user);
        assertEquals(1, profileService.getProfile(user.getEmail()).getFavoriteDestinationIds().size()); assertEquals("Updated", profileService.updateProfile(user.getEmail(), request).getName());
    }

    @Test void profileRejectsMissingUser() { when(userRepository.findByEmail("missing@test.com")).thenReturn(Optional.empty()); assertThrows(ResourceNotFoundException.class, () -> profileService.getProfile("missing@test.com")); }

    @InjectMocks ProfileService profileService;

    private static User user(Long id, String email) { return User.builder().id(id).name(email).email(email).favoriteDestinations(new HashSet<>()).build(); }
    private static Trip trip(Long id, User owner) { return Trip.builder().id(id).title("Trip").destination("Goa").user(owner).status(Trip.TripStatus.PLANNING).build(); }
    private static TripRequest tripRequest() { TripRequest request = new TripRequest(); request.setTitle("Trip"); request.setDestination("Goa"); return request; }
}
