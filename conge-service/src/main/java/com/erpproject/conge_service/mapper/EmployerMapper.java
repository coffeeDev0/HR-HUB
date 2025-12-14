package com.erpproject.conge_service.mapper;

import org.springframework.stereotype.Component;

import com.erpproject.conge_service.dto.EmployerRequest;
import com.erpproject.conge_service.models.Employer;


@Component
public class EmployerMapper {
    

    public EmployerRequest toDto(Employer employer){
        EmployerRequest employerRequest = new EmployerRequest();
        employerRequest.setUserId(employer.getUserId());
        employerRequest.setUserName(employer.getUserName());
        employerRequest.setUserPassword(employer.getUserPassword());
        employerRequest.setRole(employer.getRole());
        employerRequest.setRhId(employer.getRh().getUserId());
        return employerRequest;
    }

}
