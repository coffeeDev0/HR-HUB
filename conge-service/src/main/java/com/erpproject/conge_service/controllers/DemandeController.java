package com.erpproject.conge_service.controllers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.conge_service.dto.DemandeEvaluate;
import com.erpproject.conge_service.dto.DemandeRequest;
import com.erpproject.conge_service.dto.DemandeSearch;
import com.erpproject.conge_service.models.Demande;
import com.erpproject.conge_service.models.Employer;
import com.erpproject.conge_service.repositories.DemandeRepositorie;
import com.erpproject.conge_service.repositories.EmployerRepositorie;
import org.springframework.web.bind.annotation.CrossOrigin;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/demande/")
public class DemandeController {

    @Autowired
    private DemandeRepositorie demandeRepositorie;

    @Autowired
    private EmployerRepositorie employerRepositorie;

    @Autowired
    private com.erpproject.conge_service.services.DemandeService demandeService;

    @Operation(summary = "Créer une nouvelle demande de congé")
    @ApiResponse(responseCode = "200", description = "Demande créée avec succès")
    @ApiResponse(responseCode = "404", description = "Employé non trouvé")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @PostMapping("/{userId}")
    public ResponseEntity<DemandeRequest> createDemande(
            @PathVariable("userId") String userId,
            @RequestBody DemandeRequest demandeRequest) {
        
        try {
            Optional<Employer> employerOpt = employerRepositorie.findById(UUID.fromString(userId));
            if (employerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Employer employer = employerOpt.get();

            Demande demande = new Demande();
            demande.setRaison(demandeRequest.getRaison());
            demande.setStatus("EN COURS");
            demande.setDateDebut(demandeRequest.getDateDebut());
            demande.setDateFin(demandeRequest.getDateFin());
            demande.setEmployer(employer);

            Demande savedDemande = demandeRepositorie.save(demande);


            DemandeRequest demandeResponse = new DemandeRequest();
            demandeResponse.setRaison(savedDemande.getRaison());
            demandeResponse.setDateDebut(savedDemande.getDateDebut());
            demandeResponse.setDateFin(savedDemande.getDateFin());
            return ResponseEntity.ok(demandeResponse);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(summary = "Récupérer toutes les demandes")
    @ApiResponse(responseCode = "200", description = "Liste des demandes")
    @GetMapping("/all")
    public ResponseEntity<List<DemandeSearch>> getAllDemandes() {
        List<Demande> demandes = demandeRepositorie.findAll();
        List<DemandeSearch> demandesSearchs = demandes.stream().map(demande -> {
            DemandeSearch dto = new DemandeSearch();
            dto.setDemandeId(demande.getDemandeId());
            dto.setEmployerId(demande.getEmployer().getUserId());
            dto.setDateDebut(demande.getDateDebut());
            dto.setDateFin(demande.getDateFin());
            dto.setStatus(demande.getStatus());
            dto.setRhId(demande.getEmployer().getRh().getUserId());
            dto.setRaison(demande.getRaison());
            dto.setCommentaire(demande.getCommentaire());
            return dto;
        }).toList();
        return ResponseEntity.ok(demandesSearchs);
    }

    @Operation(summary = "Récupérer les demandes d'un employé")
    @GetMapping("/{email}")
    public ResponseEntity<List<DemandeSearch>> getDemandesByEmployer(@PathVariable("email") String email) {
        List<Demande> demandes = demandeService.findDemandeByEmail(email);
        List<DemandeSearch> demandesSearchs = demandes.stream().map(demande -> {
            DemandeSearch dto = new DemandeSearch();
            dto.setRaison(demande.getRaison());
            dto.setDemandeId(demande.getDemandeId());
            dto.setEmployerId(demande.getEmployer().getUserId());
            dto.setDateDebut(demande.getDateDebut());
            dto.setDateFin(demande.getDateFin());
            dto.setStatus(demande.getStatus());
            dto.setRhId(demande.getEmployer().getRh().getUserId());
            dto.setCommentaire(demande.getCommentaire());
            return dto;
        }).toList();
        return ResponseEntity.ok(demandesSearchs);
    }

    @Operation(summary = "Evaluer(accepter/refuser) une demande de congé")
    @PostMapping("/evaluate/{demandeId}")
    public ResponseEntity<String> evaluateDemande(
        @PathVariable("demandeId") UUID demandeId,
        @RequestBody DemandeEvaluate demandeEvaluate) {
        try {
            Optional<Demande> demandeOpt = demandeRepositorie.findById(demandeId);
            if (demandeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Demande demande = demandeOpt.get();
            Employer employer = demande.getEmployer();
            if (employer.getRh() == null || !employer.getRh().getUserId().equals(demandeEvaluate.getRhId())) {
                return ResponseEntity.status(403).body("Vous n'êtes pas autorisé à évaluer cette demande");
            }
            demande.setStatus(demandeEvaluate.getStatus());
            demande.setCommentaire(demandeEvaluate.getCommentaire());
            demandeRepositorie.save(demande);
        } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        return ResponseEntity.ok("Statut mis à jour avec succès");
    }

    @Operation(summary = "supprimer une demande")
    @DeleteMapping("/{demandeId}")
    public ResponseEntity<String> deleteDemande(@PathVariable UUID demandeId){
        if(demandeService.deleteDemande(demandeId)){
            return ResponseEntity.ok("Supprimer avec succes");
        }else{
            return ResponseEntity.notFound().build();
        }
        
    }

    @Operation(summary = "mise a jour demande")
    @PutMapping("/{demandeId}")
    public DemandeRequest updateDemande(@PathVariable UUID demandeId, @RequestBody DemandeRequest demandeRequest) {
        return demandeService.updateDemande(demandeId, demandeRequest);
    }

}
