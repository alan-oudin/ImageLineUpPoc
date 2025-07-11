package com.pocimage.model;

public class UploadResponse {
    private String thumbnailUrl;
    private String message;

    public UploadResponse() {}
    public UploadResponse(String thumbnailUrl, String message) {
        this.thumbnailUrl = thumbnailUrl;
        this.message = message;
    }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
} 