package com.erp.tache_service.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.erp.tache_service.dto.RhRequest;
import com.erp.tache_service.dto.RhResult;
import com.erp.tache_service.models.Rh;

@Component
public class RhMapper {

    @Autowired
    private TacheMapper tacheMapper;


    public Rh toEntity(RhRequest rhRequest) {
        Rh entity = new Rh();
        entity.setEmail(rhRequest.getEmail());
        return entity;
    }

    public RhResult toDto(Rh rh) {
        RhResult rhResult = new RhResult();
        rhResult.setRhId(rh.getRhId());
        rhResult.setEmail(rh.getEmail());
        rhResult.setTaches(tacheMapper.toDtoList(rh.getTaches()));

        return rhResult;
    }
}
