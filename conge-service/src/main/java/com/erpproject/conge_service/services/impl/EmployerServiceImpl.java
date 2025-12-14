package com.erpproject.conge_service.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.erpproject.conge_service.dto.EmployerRequest;
import com.erpproject.conge_service.mapper.EmployerMapper;
import com.erpproject.conge_service.models.Employer;
import com.erpproject.conge_service.repositories.EmployerRepositorie;
import com.erpproject.conge_service.services.EmployerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployerServiceImpl implements EmployerService {
    private final EmployerRepositorie employerRepositorie;
    private final EmployerMapper employerMapper;

    @Override
    public List<EmployerRequest> findAllEmployer(){

        List<Employer> employers = employerRepositorie.findAll();

        List<EmployerRequest> employersRequest=employers.stream()
            .map(employerMapper::toDto)
            .toList();

        return employersRequest;
    }


    @Override
    public Optional<EmployerRequest> findByEmail(String email){
        List <Employer> employers = employerRepositorie.findAll();
        Optional<Employer> employer = employers.stream()
            .filter(u -> u.getEmail().equals(email))
            .findFirst();
        Optional<EmployerRequest> employerOptional = Optional.of(new EmployerRequest());

        if(employer.isPresent()){
            employerOptional.get().setRhId(employer.get().getRh().getUserId());
            employerOptional.get().setRole(employer.get().getRole());
            employerOptional.get().setUserId(employer.get().getUserId());
            employerOptional.get().setUserName(employer.get().getUserName());
            employerOptional.get().setUserPassword(employer.get().getUserPassword());
        }
        return employerOptional;
    }

}
