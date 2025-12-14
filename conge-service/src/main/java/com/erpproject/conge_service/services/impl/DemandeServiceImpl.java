package com.erpproject.conge_service.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erpproject.conge_service.dto.DemandeRequest;
import com.erpproject.conge_service.dto.EmployerRequest;
import com.erpproject.conge_service.models.Demande;
import com.erpproject.conge_service.repositories.DemandeRepositorie;
import com.erpproject.conge_service.services.DemandeService;
import com.erpproject.conge_service.services.EmployerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DemandeServiceImpl implements DemandeService {

    private final DemandeRepositorie demandeRepositorie;
    private final EmployerService employerService;

    @Override
    public Boolean deleteDemande(UUID demandeId){

        Optional<Demande> demande = demandeRepositorie.findById(demandeId);
        if(demande.isEmpty()){
            return false;
        }
        demandeRepositorie.delete(demande.get());
        return true;
    }

    @Override
    public DemandeRequest updateDemande(UUID demandeId,DemandeRequest demandeRequest){
        Optional<Demande> employerDemande = demandeRepositorie.findById(demandeId);
        if(employerDemande.isEmpty()){
            throw new IllegalArgumentException("demande non trouver");
        }

        Demande demande = employerDemande.get();
        demande.setRaison(demandeRequest.getRaison());
        demande.setDateDebut(demandeRequest.getDateDebut());
        demande.setDateFin(demandeRequest.getDateFin());

        demandeRepositorie.save(demande);
        return demandeRequest;
    
    }

    public List<Demande> findDemandeByEmail(String email){
        Optional<EmployerRequest> employer = employerService.findByEmail(email);

        if(employer.isEmpty()){
            throw new IllegalArgumentException("User pas trouver");
        }
        List<Demande> demandes = demandeRepositorie.findAll().stream()
                                    .filter(u -> u.getEmployer().getUserId().equals(employer.get().getUserId()))
                                    .toList();
        return demandes;


    }

}
