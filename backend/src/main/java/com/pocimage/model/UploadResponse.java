package com.pocimage.model;

public class UploadResponse {
    private String thumbnailUrl;
    private String message;
    private String originalUrl;
    private String publicId;
    private long originalSize;
    private long thumbnailSize;

    public UploadResponse() {}
    public UploadResponse(String thumbnailUrl, String message, String originalUrl, String publicId, long originalSize, long thumbnailSize) {
        this.thumbnailUrl = thumbnailUrl;
        this.message = message;
        this.originalUrl = originalUrl;
        this.publicId = publicId;
        this.originalSize = originalSize;
        this.thumbnailSize = thumbnailSize;
    }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }
    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }
    public long getOriginalSize() { return originalSize; }
    public void setOriginalSize(long originalSize) { this.originalSize = originalSize; }
    public long getThumbnailSize() { return thumbnailSize; }
    public void setThumbnailSize(long thumbnailSize) { this.thumbnailSize = thumbnailSize; }
} 