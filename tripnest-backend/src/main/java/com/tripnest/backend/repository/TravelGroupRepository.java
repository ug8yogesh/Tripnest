package com.tripnest.backend.repository;

import com.tripnest.backend.entity.TravelGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TravelGroupRepository extends JpaRepository<TravelGroup, Long> {
    Optional<TravelGroup> findByTripId(Long tripId);
    List<TravelGroup> findByCreatedById(Long userId);
}
