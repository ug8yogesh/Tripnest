package com.tripnest.backend.repository;

import com.tripnest.backend.entity.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    List<GroupMessage> findByGroupIdOrderBySentAtAsc(Long groupId);
}
