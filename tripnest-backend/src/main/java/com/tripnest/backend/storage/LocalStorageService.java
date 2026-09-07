package com.tripnest.backend.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {
    private final Path uploadDirectory;

    public LocalStorageService(@Value("${app.upload-dir:uploads}") String uploadDirectory) {
        this.uploadDirectory = Paths.get(uploadDirectory).toAbsolutePath().normalize();
        try { Files.createDirectories(this.uploadDirectory); }
        catch (IOException ex) { throw new IllegalStateException("Unable to create upload directory", ex); }
    }

    @Override
    public String store(MultipartFile file) throws IOException {
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String storedFilename = UUID.randomUUID() + (extension == null ? "" : "." + extension);
        Files.copy(file.getInputStream(), uploadDirectory.resolve(storedFilename));
        return storedFilename;
    }

    @Override
    public Resource load(String storedFilename) {
        Path resolved = uploadDirectory.resolve(storedFilename).normalize();
        if (!resolved.startsWith(uploadDirectory)) throw new IllegalArgumentException("Invalid stored filename");
        return new FileSystemResource(resolved);
    }

    @Override
    public void delete(String storedFilename) throws IOException {
        Files.deleteIfExists(uploadDirectory.resolve(storedFilename).normalize());
    }
}
