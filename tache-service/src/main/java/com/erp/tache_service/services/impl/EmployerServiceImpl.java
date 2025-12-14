package com.erp.tache_service.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erp.tache_service.dto.EmployerRequest;
import com.erp.tache_service.dto.EmployerResult;
import com.erp.tache_service.mapper.EmployerMapper;
import com.erp.tache_service.models.Employer;
import com.erp.tache_service.repository.EmployerRepository;

import com.erp.tache_service.services.EmployerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployerServiceImpl implements EmployerService {
    
    private final EmployerRepository EmployerRepositoty;
    private final EmployerMapper EmployerMapper;
    
    @Override
    public Employer createEmployer(EmployerRequest EmployerRequest){

        if(EmployerRepositoty.findByEmail(EmployerRequest.getEmail()).isPresent()){
            throw new RuntimeException("Employer avec cet email existe déjà");
        }

        Employer Employer = EmployerMapper.toEntity(EmployerRequest);
    
        return EmployerRepositoty.save(Employer);
    }

    @Override
    public EmployerResult getEmployerByEmail(String email){
        Employer Employer = EmployerRepositoty.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Employer introuvable"));

        return EmployerMapper.toDto(Employer);
    }

    @Override
    public List<EmployerResult> getAllEmployers(){
        List<Employer> Employers = EmployerRepositoty.findAll();
        return Employers.stream().map(EmployerMapper::toDto).toList();
    }

}
