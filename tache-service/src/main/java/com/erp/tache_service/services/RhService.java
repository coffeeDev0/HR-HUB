package com.erp.tache_service.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erp.tache_service.dto.RhRequest;
import com.erp.tache_service.dto.RhResult;
import com.erp.tache_service.models.Rh;

@Service
public interface RhService {
    

    public Rh createRh(RhRequest rhRequest);

    public RhResult getRhByEmail(String email);

    public List<RhResult> getAllRhs();

    public void confiTache(UUID tacheId, List<UUID> employers);

    public Boolean validerTache(UUID tacheId,Boolean avis);
}
