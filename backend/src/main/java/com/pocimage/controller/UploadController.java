package com.pocimage.controller;

import com.pocimage.model.UploadResponse;
import com.pocimage.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping
    public ResponseEntity<UploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            CloudinaryService.UploadResult result = cloudinaryService.uploadAndGetThumbnailInfo(file);
            return ResponseEntity.ok(new UploadResponse(result.thumbnailUrl, "Upload réussi", result.originalUrl, result.publicId, result.originalSize, result.thumbnailSize));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new UploadResponse(null, "Erreur lors de l'upload : " + e.getMessage(), null, null, 0, 0));
        }
    }
} 