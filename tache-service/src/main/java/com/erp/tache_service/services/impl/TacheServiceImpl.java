package com.erp.tache_service.services.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erp.tache_service.dto.EmployerResult;
import com.erp.tache_service.dto.TacheRequest;
import com.erp.tache_service.dto.TacheResult;
import com.erp.tache_service.mapper.EmployerMapper;
import com.erp.tache_service.mapper.TacheMapper;
import com.erp.tache_service.models.Employer;
import com.erp.tache_service.models.Taches;
import com.erp.tache_service.repository.EmployerRepository;
import com.erp.tache_service.repository.TacheRepository;
import com.erp.tache_service.services.TacheService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TacheServiceImpl implements TacheService {
    
    private final TacheRepository tacheRepository;
    private final TacheMapper tacheMapper;
    private final EmployerRepository employerRepository;
    private final EmployerMapper employerMapper;

    @Override
    public List<TacheResult> getAllTaches(){
        List<Taches> taches = tacheRepository.findAll();
        return taches.stream().map(tacheMapper::toDto).toList();
    }

    @Override
    public List<TacheResult> getTachesByEmployer(String email){
        List<Taches> taches = tacheRepository.findByEmployers_Email(email);
        
        return taches.stream().map(tacheMapper::toDto).toList();
    }

    @Override
    public List<TacheResult> getTachesByRh(String email){
        List<Taches> taches = tacheRepository.findByRhEmail(email);
        
        return taches.stream().map(tacheMapper::toDto).toList();
    }

    @Override
    public TacheResult createTache(TacheRequest tacheRequest){
        Taches tache = tacheMapper.toEntity(tacheRequest);

        Taches tacheSave = tacheRepository.save(tache);

        return tacheMapper.toDto(tacheSave);
    }

    @Override
    public TacheResult updateTache(UUID tacheId, TacheRequest tacheRequest){
        Taches existingTache = tacheRepository.findById(tacheId).orElseThrow(() -> new RuntimeException("Tache not found"));
        existingTache.setNomTache(tacheRequest.getNom());
        existingTache.setDescription(tacheRequest.getDescription());
        existingTache.setPriorite(tacheRequest.getPriorite());
        existingTache.setDateFin(tacheRequest.getDateFin());
        Taches result = tacheRepository.save(existingTache);

        return tacheMapper.toDto(result);
    }

    @Override
    public void deleteTache(UUID tacheId){
        tacheRepository.deleteById(tacheId);
    }

    @Override
    public List<EmployerResult> getAllEmployerByTache(UUID tacheId) {

        List<Employer> allEmployers = employerRepository.findAll();

        List<Employer> employersTache = allEmployers.stream()
                .filter(e -> e.getTaches() != null && 
                            e.getTaches().stream()
                                .anyMatch(t -> t.getTacheId().equals(tacheId)))
                .toList();
        List<EmployerResult> employerResults = employersTache.stream().map(employerMapper::toDto).toList();
        return employerResults;
    }
}
