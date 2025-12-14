package com.erp.tache_service.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erp.tache_service.dto.RhRequest;
import com.erp.tache_service.dto.RhResult;
import com.erp.tache_service.mapper.RhMapper;
import com.erp.tache_service.models.Employer;
import com.erp.tache_service.models.Rh;
import com.erp.tache_service.models.Taches;
import com.erp.tache_service.repository.EmployerRepository;
import com.erp.tache_service.repository.RhRepositoty;
import com.erp.tache_service.repository.TacheRepository;
import com.erp.tache_service.services.RhService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RhServiceImpl implements RhService {
    
    private final RhRepositoty rhRepositoty;
    private final RhMapper rhMapper;
    private final TacheRepository tacheRepository;
    private final EmployerRepository employerRepository;
    
    @Override
    public Rh createRh(RhRequest rhRequest){
        Rh rh = rhMapper.toEntity(rhRequest);

        if(rhRepositoty.findByEmail(rhRequest.getEmail()).isPresent()){
            throw new RuntimeException("RH avec cet email existe déjà");
        }
        return rhRepositoty.save(rh);
    }

    @Override
    public RhResult getRhByEmail(String email){
        Rh rh = rhRepositoty.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("RH introuvable"));

        return rhMapper.toDto(rh);
    }

    @Override
    public List<RhResult> getAllRhs(){
        List<Rh> rhs = rhRepositoty.findAll();
        return rhs.stream().map(rhMapper::toDto).toList();
    }

    @Override
    public void confiTache(UUID tacheId, List<UUID> employersId) {
        Taches tache = tacheRepository.findById(tacheId)
            .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'ID: " + tacheId));
        
        List<Employer> employers = new ArrayList<>(
            tache.getEmployers() != null ? tache.getEmployers() : new ArrayList<>()
        );
        
        List<Employer> nouveauxEmployers = employerRepository.findAllById(employersId);
        
        if (nouveauxEmployers.size() != employersId.size()) {
            throw new RuntimeException("Certains employés n'ont pas été trouvés");
        }
        
        for (Employer emp : nouveauxEmployers) {
            if (!employers.contains(emp)) {
                employers.add(emp);
            }
        }
        
        tache.setEmployers(employers);
        tacheRepository.save(tache);
    }

    @Override
    public Boolean validerTache(UUID tacheId,Boolean avis){

        Taches tache = tacheRepository.findById(tacheId)
            .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'ID: " + tacheId));
        
        if(avis == true){
            tache.setEtat("TERMINER");
        }else{
            tache.setEtat("A REFAIRE");
        }

        tacheRepository.save(tache);
        return avis;
    }
}
