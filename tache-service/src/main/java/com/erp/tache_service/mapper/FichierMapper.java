package com.erp.tache_service.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.erp.tache_service.dto.FichierRequest;
import com.erp.tache_service.dto.FichierResult;
import com.erp.tache_service.models.Employer;
import com.erp.tache_service.models.Fichier;
import com.erp.tache_service.models.Taches;
import com.erp.tache_service.repository.EmployerRepository;
import com.erp.tache_service.repository.TacheRepository;

@Component
public class FichierMapper {

    @Autowired
    private TacheRepository tacheRepository;

    @Autowired
    private EmployerRepository employerRepository;

    public Fichier toEntity(FichierRequest fichierRequest) {
        if (fichierRequest == null || fichierRequest.getFile() == null) {
            throw new IllegalArgumentException("FichierRequest ou fichier ne peut pas être null");
        }
        
        Fichier fichier = new Fichier();
        fichier.setName(fichierRequest.getFile().getOriginalFilename());

        Taches tache = tacheRepository.findById(fichierRequest.getTacheId())
            .orElseThrow(() -> new RuntimeException(
                "Tâche non trouvée avec l'ID: " + fichierRequest.getTacheId()
            ));
        
        fichier.setTache(tache);
        
        Employer employer = employerRepository.findById(fichierRequest.getEmployerId())
            .orElseThrow(() -> new RuntimeException(
                "Employer non trouvée avec l'ID: " + fichierRequest.getTacheId()
            ));
        fichier.setEmployer(employer);

        return fichier;
    }

    public FichierResult toDto(Fichier fichier) {
        if (fichier == null) {
            return null;
        }
        
        FichierResult fichierResult = new FichierResult();
        fichierResult.setId(fichier.getId());
        fichierResult.setName(fichier.getName());
        fichierResult.setUrl(fichier.getUrl());
        fichierResult.setContentType(fichier.getContentType());
        fichierResult.setExtension(fichier.getExtension());
        fichierResult.setFileSize(fichier.getFileSize());
        fichierResult.setEmployerId(fichier.getEmployer().getEmployerId());
        
        if (fichier.getTache() != null) {
            fichierResult.setTacheId(fichier.getTache().getTacheId());
        } else {
            throw new IllegalStateException(
                "Le fichier avec l'ID " + fichier.getId() + " n'a pas de tâche associée"
            );
        }
        
        return fichierResult;
    }
}