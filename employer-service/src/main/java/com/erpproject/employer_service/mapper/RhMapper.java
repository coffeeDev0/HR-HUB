package com.erpproject.employer_service.mapper;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.erpproject.employer_service.dto.EmployerRequest;
import com.erpproject.employer_service.dto.EmployerResult;
import com.erpproject.employer_service.dto.RhResult;
import com.erpproject.employer_service.models.Rh;
import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.repository.RhRepositorie;

@Component
public class RhMapper {

    @Autowired
    private EmployerMapper employerMapper;

    @Autowired
    private RhRepositorie rhRepositorie;

    public RhResult toDto(Rh rh) {
        RhResult rhResult = new RhResult();
        rhResult.setId(rh.getUserId());
        rhResult.setUserName(rh.getUserName());
        rhResult.setUserPassword(rh.getUserPassword());
        rhResult.setRole(rh.getRole());
        rhResult.setRhId(rh.getRh().getUserId());

        List<EmployerResult> employerResults = (rh.getEmployers() != null)
                ? rh.getEmployers().stream()
                        .map(employerMapper::toDto)
                        .toList()
                : List.of();

        rhResult.setEmployers(employerResults);
        return rhResult;
    }

    public Rh toEntity(EmployerRequest employer) {
        Rh rh = new Rh();
        rh.setUserName(employer.getUserName());
        rh.setUserPassword(employer.getUserPassword());
        rh.setTel(employer.getTel());
        rh.setEmail(employer.getEmail());
        rh.setUserPrenom(employer.getUserPrenom());
        rh.setProfession(employer.getProfession());
        rh.setStatus(employer.getStatus());

        Optional<Rh> optionalRh = rhRepositorie.findById(employer.getRhId());
        if (optionalRh.isPresent()) {
            rh.setRh(optionalRh.get());
        } else {
            throw new IllegalArgumentException("Rh not found with id: " + employer.getRhId());
        }

        rh.setRole(Roles.RH.name());
        return rh;
    }
}
