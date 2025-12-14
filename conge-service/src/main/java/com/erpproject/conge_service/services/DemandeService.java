package com.erpproject.conge_service.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erpproject.conge_service.dto.DemandeRequest;
import com.erpproject.conge_service.models.Demande;

@Service
public interface DemandeService {
    public Boolean deleteDemande(UUID deemandeId);

    public DemandeRequest updateDemande(UUID demandeId, DemandeRequest demandeRequest);

    public List<Demande> findDemandeByEmail(String email);
}
