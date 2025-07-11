package com.pocimage.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Value("${cloudinary.folder}")
    private String folder;

    public static class UploadResult {
        public String thumbnailUrl;
        public String originalUrl;
        public String publicId;
        public long originalSize;
        public long thumbnailSize;
        public UploadResult(String thumbnailUrl, String originalUrl, String publicId, long originalSize, long thumbnailSize) {
            this.thumbnailUrl = thumbnailUrl;
            this.originalUrl = originalUrl;
            this.publicId = publicId;
            this.originalSize = originalSize;
            this.thumbnailSize = thumbnailSize;
        }
    }

    private long getRemoteFileSize(String fileUrl) {
        try {
            URL url = new URL(fileUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("HEAD");
            conn.getInputStream();
            int length = conn.getContentLength();
            conn.disconnect();
            return length > 0 ? length : -1;
        } catch (Exception e) {
            return -1;
        }
    }

    public UploadResult uploadAndGetThumbnailInfo(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", folder
        ));
        String publicId = (String) uploadResult.get("public_id");
        String cloudName = cloudinary.config.cloudName;
        String thumbnailUrl = "https://res.cloudinary.com/" + cloudName + "/image/upload/w_300,c_limit/" + publicId + ".jpg";
        String originalUrl = (String) uploadResult.get("secure_url");
        long originalSize = file.getSize();
        long thumbnailSize = getRemoteFileSize(thumbnailUrl);
        return new UploadResult(thumbnailUrl, originalUrl, publicId, originalSize, thumbnailSize);
    }
} 