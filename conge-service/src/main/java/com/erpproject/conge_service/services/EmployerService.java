package com.erpproject.conge_service.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.erpproject.conge_service.dto.EmployerRequest;

@Service
public interface EmployerService {
    
    public List<EmployerRequest> findAllEmployer();

    public Optional<EmployerRequest> findByEmail(String email);
}
