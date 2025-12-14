package com.erp.tache_service.dto;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class TacheResult {
    private UUID tacheId;
    private String nom;
    private String description;
    private Integer priorite;
    private String etat;
    private Date dateDebut;
    private Date dateFin;
    private UUID rhId;
    private List<FichierResult> fichiers;
}
