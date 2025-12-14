package com.erpproject.conge_service.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class DemandeEvaluate {
    private String status;
    private UUID rhId;
    private String commentaire;
}
