package com.erp.tache_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erp.tache_service.dto.EmployerResult;
import com.erp.tache_service.dto.EmployerRequest;
import com.erp.tache_service.models.Employer;

@Service
public interface EmployerService {
    

    public Employer createEmployer(EmployerRequest EmployerRequest);

    public EmployerResult getEmployerByEmail(String email);

    public List<EmployerResult> getAllEmployers();
}
