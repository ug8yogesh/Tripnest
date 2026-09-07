package com.tripnest.backend.dto;

import lombok.Data;

@Data
public class GroupRequest {
    private String name;
    private Long tripId;
}
