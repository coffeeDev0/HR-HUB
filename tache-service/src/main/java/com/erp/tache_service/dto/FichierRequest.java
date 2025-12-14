package com.erp.tache_service.dto;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class FichierRequest {
    
    private MultipartFile file;
    private UUID tacheId;
    private UUID employerId;
}
