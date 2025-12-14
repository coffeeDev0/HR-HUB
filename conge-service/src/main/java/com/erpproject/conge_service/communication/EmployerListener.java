package com.erpproject.conge_service.communication;

import java.util.Optional;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.erpproject.conge_service.dto.EmployerRequest;
import com.erpproject.conge_service.dto.RhRequest;
import com.erpproject.conge_service.models.Employer;
import com.erpproject.conge_service.models.Rh;
import com.erpproject.conge_service.repositories.EmployerRepositorie;
import com.erpproject.conge_service.repositories.RhRepositorie;

@Service
public class EmployerListener {

    private final EmployerRepositorie employerRepositorie;
    private final RhRepositorie rhRepositorie;

    public EmployerListener(EmployerRepositorie employerRepositorie, RhRepositorie rhRepositorie) {
        this.employerRepositorie = employerRepositorie;
        this.rhRepositorie = rhRepositorie;
    }

    @RabbitListener(queues = RabbitConfig.EMPLOYER_QUEUE, containerFactory = "rabbitListenerContainerFactory")
    public void receiveEmployer(EmployerRequest employerRequest) {
        System.out.println("NOUVEL EMPLOYÉ REÇU DANS CONGE-SERVICE: " + employerRequest.getUserName());

        try {
            Optional<Rh> rhOpt = rhRepositorie.findById(employerRequest.getRhId());
            
            if (rhOpt.isEmpty()) {
                System.err.println("ERREUR: Impossible de lier l'employé. RH avec ID " + employerRequest.getRhId() + " non trouvé.");
                return; 
            }

            Employer employer = new Employer();
            employer.setUserId(employerRequest.getUserId());
            employer.setUserName(employerRequest.getUserName());
            employer.setUserPassword(employerRequest.getUserPassword());
            employer.setRole(employerRequest.getRole());
            employer.setRh(rhOpt.get());
            
            employerRepositorie.save(employer);
            System.out.println("Employé " + employer.getUserName() + " sauvegardé avec succès.");

        } catch (Exception e) {
            System.err.println("Erreur fatale de persistance de l'employé: " + e.getMessage());
            throw new RuntimeException("Échec de traitement du message Employeur.", e);
        }
    }

    @RabbitListener(queues = RabbitConfig.RH_QUEUE, containerFactory = "rabbitListenerContainerFactory")
    public void receiveRh(RhRequest rhRequest) {
        System.out.println("NOUVEAU RH REÇU DANS CONGE-SERVICE");

        Optional<Rh> existingRh = rhRepositorie.findById(rhRequest.getUserId());
        
        Rh rh = existingRh.orElseGet(Rh::new);
        
        rh.setUserId(rhRequest.getUserId());
        rh.setUserName(rhRequest.getUserName());
        rh.setUserPassword(rhRequest.getUserPassword());
        rh.setRole(rhRequest.getRole());

        rhRepositorie.save(rh);
        System.out.println("RH " + rh.getUserName() + " sauvegardé/mis à jour avec succès.");
    }
}