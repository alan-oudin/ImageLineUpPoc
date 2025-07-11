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
            String thumbnailUrl = cloudinaryService.uploadAndGetThumbnailUrl(file);
            return ResponseEntity.ok(new UploadResponse(thumbnailUrl, "Upload réussi"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new UploadResponse(null, "Erreur lors de l'upload : " + e.getMessage()));
        }
    }
} 