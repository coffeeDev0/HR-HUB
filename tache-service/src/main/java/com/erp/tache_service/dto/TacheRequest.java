package com.erp.tache_service.dto;

import java.sql.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class TacheRequest {
    
    private String nom;
    private String description;
    private Integer priorite = 1;
    private Date dateFin;
    private UUID rhId;
}
