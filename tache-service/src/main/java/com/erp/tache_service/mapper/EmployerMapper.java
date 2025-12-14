package com.erp.tache_service.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.erp.tache_service.dto.EmployerRequest;
import com.erp.tache_service.dto.EmployerResult;
import com.erp.tache_service.models.Employer;

@Component
public class EmployerMapper {

    @Autowired
    private TacheMapper tacheMapper;

    public Employer toEntity(EmployerRequest request) {
        Employer employer = new Employer();
        employer.setEmail(request.getEmail());
        return employer;
    }

    public EmployerResult toDto(Employer employer) {
        EmployerResult employerResult = new EmployerResult();
        employerResult.setEmployerId(employer.getEmployerId());
        employerResult.setEmail(employer.getEmail());
        employerResult.setTaches(tacheMapper.toDtoList(employer.getTaches()));
        return employerResult;
    }
}
