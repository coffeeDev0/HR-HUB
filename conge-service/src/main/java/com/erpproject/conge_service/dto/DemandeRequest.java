package com.erpproject.conge_service.dto;

import java.util.Date;

import lombok.Data;

@Data
public class DemandeRequest {
    private String raison;
    private Date dateDebut;
    private Date dateFin;
}
