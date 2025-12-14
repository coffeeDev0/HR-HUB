package com.erp.tache_service.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erp.tache_service.dto.EmployerResult;
import com.erp.tache_service.dto.TacheRequest;
import com.erp.tache_service.dto.TacheResult;

@Service
public interface TacheService {
    

    public List<TacheResult> getAllTaches();

    public List<TacheResult> getTachesByEmployer(String email);

    public List<TacheResult> getTachesByRh(String email);
    
    public TacheResult createTache(TacheRequest tacheRequest);

    public TacheResult updateTache(UUID tacheId, TacheRequest tacheRequest);

    public void deleteTache(UUID tacheId);

    public List<EmployerResult> getAllEmployerByTache(UUID tacheId);

}
