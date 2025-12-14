package com.erp.tache_service.communication;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.erp.tache_service.dto.EmployerRequest;
import com.erp.tache_service.dto.RhRequest;
import com.erp.tache_service.models.Employer;
import com.erp.tache_service.models.Rh;
import com.erp.tache_service.services.EmployerService;
import com.erp.tache_service.services.RhService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Listener pour recevoir les messages RabbitMQ concernant les employés et RH
 * CORRECTIONS:
 * - Suppression de @Autowired redondant avec @RequiredArgsConstructor
 * - Ajout de logs structurés avec Slf4j
 * - Amélioration de la gestion d'erreurs
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmployerListener {

    private final EmployerService employerService;
    private final RhService rhService;

    @RabbitListener(queues = RabbitConfig.EMPLOYER_QUEUE, containerFactory = "rabbitListenerContainerFactory")
    public void receiveEmployer(EmployerRequest employerRequest) {
        log.info("📥 NOUVEL EMPLOYÉ REÇU - Email: {}", 
                employerRequest.getEmail());

        try {
            if (employerRequest.getEmail() == null || employerRequest.getEmail().isEmpty()) {
                log.error("❌ Email de l'employé est null ou vide");
                throw new IllegalArgumentException("Email requis pour créer un employé");
            }

            // Création de l'employé
            Employer employer = employerService.createEmployer(employerRequest);

            log.info("✅ Employé sauvegardé avec succès - ID: {}, Email: {}", 
                    employer.getEmployerId(), 
                    employer.getEmail());

        } catch (IllegalArgumentException e) {
            log.error("❌ Validation échouée pour l'employé: {}", e.getMessage());
        } catch (Exception e) {
            log.error("❌ Erreur fatale lors de la persistance de l'employé: {}", 
                    e.getMessage(), e);
            throw new RuntimeException("Échec de traitement du message Employeur", e);
        }
    }

    @RabbitListener(queues = RabbitConfig.RH_QUEUE, containerFactory = "rabbitListenerContainerFactory")
    public void receiveRh(RhRequest rhRequest) {
        log.info("📥 NOUVEAU RH REÇU - Email: {}", 
                rhRequest.getEmail());

        try {
            if (rhRequest.getEmail() == null || rhRequest.getEmail().isEmpty()) {
                log.error("❌ Email du RH est null ou vide");
                throw new IllegalArgumentException("Email requis pour créer un RH");
            }

            Rh rh = rhService.createRh(rhRequest);

            log.info("✅ RH sauvegardé avec succès - ID: {}, Email: {}", 
                    rh.getRhId(), 
                    rh.getEmail());

        } catch (IllegalArgumentException e) {
            log.error("❌ Validation échouée pour le RH: {}", e.getMessage());
        } catch (Exception e) {
            log.error("❌ Erreur fatale lors de la persistance du RH: {}", 
                    e.getMessage(), e);
            throw new RuntimeException("Échec de traitement du message RH", e);
        }
    }
}