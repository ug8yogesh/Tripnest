package com.tripnest.backend.repository;

import com.tripnest.backend.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByTripIdOrderByCreatedAtDesc(Long tripId);
}
