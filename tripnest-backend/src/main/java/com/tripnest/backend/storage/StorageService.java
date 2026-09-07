package com.tripnest.backend.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {
    String store(MultipartFile file) throws IOException;
    Resource load(String storedFilename);
    void delete(String storedFilename) throws IOException;
}
