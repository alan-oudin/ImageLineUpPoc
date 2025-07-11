package com.pocimage.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Value("${cloudinary.folder}")
    private String folder;

    public String uploadAndGetThumbnailUrl(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", folder
        ));
        String publicId = (String) uploadResult.get("public_id");
        String cloudName = cloudinary.config.cloudName;
        // Générer l'URL du thumbnail (300px de large)
        return "https://res.cloudinary.com/" + cloudName + "/image/upload/w_300,c_limit/" + publicId + ".jpg";
    }
} 