package com.erpproject.conge_service.dto;

import java.util.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class DemandeSearch {
    private UUID demandeId;
    private UUID employerId;
    private UUID rhId;
    private String raison;
    private Date dateDebut;
    private Date dateFin;
    private String status;
    private String commentaire;
}


