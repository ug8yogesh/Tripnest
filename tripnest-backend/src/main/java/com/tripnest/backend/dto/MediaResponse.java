package com.tripnest.backend.dto;

import com.tripnest.backend.entity.Media;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data @AllArgsConstructor
public class MediaResponse {
    private Long id;
    private String originalFilename;
    private String contentType;
    private Long size;
    private String mediaType;
    private String url;
    private Long tripId;
    private Long userId;
    private LocalDateTime createdAt;

    public static MediaResponse from(Media media, String url) {
        return new MediaResponse(media.getId(), media.getOriginalFilename(), media.getContentType(), media.getSize(),
                media.getMediaType(), url, media.getTrip().getId(), media.getUser() == null ? null : media.getUser().getId(), media.getCreatedAt());
    }
}
