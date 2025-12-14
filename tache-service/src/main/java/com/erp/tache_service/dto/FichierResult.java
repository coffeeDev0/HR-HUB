package com.erp.tache_service.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class FichierResult {
    
    private Long id;
    private String name;
    private String url;
    private UUID tacheId;
    private UUID employerId;
    
    private Long fileSize;
    private String contentType;
    private String extension;
}