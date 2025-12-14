package com.erpproject.employer_service.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erpproject.employer_service.dto.EmployerRequest;
import com.erpproject.employer_service.dto.EmployerResult;
import com.erpproject.employer_service.dto.RhResult;

@Service
public interface RhService {
    public RhResult createRh(EmployerRequest employerRequest);

    public List<RhResult> findAllRh();

    public List<EmployerResult> findAllEmployer(UUID rhId);

    public String updateStatus(UUID userId, String status);
}
