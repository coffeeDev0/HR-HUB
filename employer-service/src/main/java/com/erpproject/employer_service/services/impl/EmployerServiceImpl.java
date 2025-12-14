package com.erpproject.employer_service.services.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erpproject.employer_service.communication.NotificationService;
import com.erpproject.employer_service.dto.EmployerRequest;
import com.erpproject.employer_service.dto.EmployerResult;
import com.erpproject.employer_service.mapper.EmployerMapper;
import com.erpproject.employer_service.models.Employer;
import com.erpproject.employer_service.repository.EmployerRepositorie;
import com.erpproject.employer_service.secutity.PasswordUtils;
import com.erpproject.employer_service.services.EmployerService;
import com.erpproject.employer_service.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployerServiceImpl implements EmployerService {

    private final EmployerRepositorie employerRepositorie;
    private final EmployerMapper employerMapper;
    private final NotificationService notificationService;
    private final UserService userService;

    private final PasswordUtils passwordUtils;

    @Override
    public EmployerResult createAndNotifyEmployer(EmployerRequest employerRequest) throws Exception {
        employerRequest.setUserPassword(passwordUtils.hashPassword(employerRequest.getUserPassword()));
        Employer employer = employerMapper.toEntity(employerRequest);
        if (employer.getRh() == null) {
            throw new Exception("Rh not found for the employer");
        }

        if (userService.findByEmail(employerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email deja utiliser");
        }

        Employer savedEmployer = employerRepositorie.save(employer);
        EmployerResult savedEmployerResult = employerMapper.toDto(savedEmployer);

        notificationService.notifyNewEmployer(savedEmployerResult);
        return savedEmployerResult;
    }

    @Override
    public List<EmployerResult> findAllEmployer() {
        List<Employer> employers = employerRepositorie.findAll();
        List<EmployerResult> employerResults = employers.stream()
                .map(employerMapper::toDto)
                .toList();
        return employerResults;
    }

    @Override
    public List<Employer> findByRh(UUID rhId) {
        return employerRepositorie.findAll().stream()
                .filter(u -> u.getRh() != null && rhId.equals(u.getRh().getUserId()))
                .toList();
    }

}