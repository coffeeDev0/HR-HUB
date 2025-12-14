package com.erp.tache_service.mapper;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.erp.tache_service.dto.TacheRequest;
import com.erp.tache_service.dto.TacheResult;
import com.erp.tache_service.models.Taches;
import com.erp.tache_service.repository.RhRepositoty;

@Component
public class TacheMapper {

    @Autowired
    private RhRepositoty rhRepository;

    @Autowired
    private FichierMapper fichierMapper;

    public TacheResult toDto(Taches tache) {
        TacheResult tacheResult = new TacheResult();
        tacheResult.setTacheId(tache.getTacheId());
        tacheResult.setNom(tache.getNomTache());
        tacheResult.setDescription(tache.getDescription());
        tacheResult.setPriorite(tache.getPriorite());
        tacheResult.setEtat(tache.getEtat());
        tacheResult.setDateDebut(tache.getDateDebut());
        tacheResult.setDateFin(tache.getDateFin());

        tacheResult.setRhId(
            tache.getRh() != null ? tache.getRh().getRhId() : null
        );
        tacheResult.setFichiers(tache.getFichiers().stream().map(fichierMapper::toDto).toList());

        return tacheResult;
    }

    public List<TacheResult> toDtoList(List<Taches> taches) {
        
        return taches.stream().map(this::toDto).toList();
    }

    public Taches toEntity(TacheRequest tacheRequest) {
        Taches tache = new Taches();
        tache.setNomTache(tacheRequest.getNom());
        tache.setDescription(tacheRequest.getDescription());
        tache.setPriorite(tacheRequest.getPriorite());
        tache.setDateFin(tacheRequest.getDateFin());
        tache.setRh(rhRepository.findById(tacheRequest.getRhId()).orElse(null));
        return tache;
    }
}
