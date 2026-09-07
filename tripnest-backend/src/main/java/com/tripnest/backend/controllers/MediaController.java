package com.tripnest.backend.controllers;

import com.tripnest.backend.entity.Media;
import com.tripnest.backend.service.MediaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController @RequestMapping("/api/media") @RequiredArgsConstructor
public class MediaController {
    private final MediaService mediaService;

    @PostMapping(value = "/trips/{tripId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(Authentication auth, @PathVariable Long tripId, @RequestParam MultipartFile file,
                                    @RequestParam(required = false) String mediaType, HttpServletRequest request) {
        return ResponseEntity.ok(mediaService.upload(auth.getName(), tripId, mediaType, file, baseUrl(request)));
    }

    @GetMapping("/trips/{tripId}")
    public ResponseEntity<List<?>> list(Authentication auth, @PathVariable Long tripId, HttpServletRequest request) {
        return ResponseEntity.ok(mediaService.list(auth.getName(), tripId, baseUrl(request)));
    }

    @GetMapping("/{mediaId}/file")
    public ResponseEntity<Resource> file(Authentication auth, @PathVariable Long mediaId) {
        Media media = mediaService.findMedia(auth.getName(), mediaId);
        MediaType contentType = media.getContentType() == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(media.getContentType());
        return ResponseEntity.ok().contentType(contentType).header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + media.getOriginalFilename() + "\"").body(mediaService.load(auth.getName(), mediaId));
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long mediaId) { mediaService.delete(auth.getName(), mediaId); return ResponseEntity.noContent().build(); }
    private String baseUrl(HttpServletRequest request) { return request.getRequestURL().toString().replace(request.getRequestURI(), ""); }
}
