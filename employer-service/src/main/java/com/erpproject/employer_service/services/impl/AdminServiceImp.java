package com.erpproject.employer_service.services.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erpproject.employer_service.communication.NotificationService;
import com.erpproject.employer_service.dto.EmployerResult;
import com.erpproject.employer_service.dto.UserRequest;
import com.erpproject.employer_service.models.Admin;
import com.erpproject.employer_service.models.Rh;
import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.models.User;
import com.erpproject.employer_service.repository.AdminRepository;
import com.erpproject.employer_service.repository.RhRepositorie;
import com.erpproject.employer_service.repository.UserRepository;
import com.erpproject.employer_service.secutity.PasswordUtils;
import com.erpproject.employer_service.services.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImp implements AdminService {

    @Value("${admin.name}")
    private String adminName;

    @Value("${admin.password}")
    private String adminPassword;

    private final PasswordUtils passwordUtils;

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final RhRepositorie rhRepositorie;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public String attributRole(UUID id, Roles role) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        if (user.getRole().equalsIgnoreCase(Roles.EMPLOYER.name()) && role == Roles.RH) {

            Rh rh = new Rh();
            rh.setUserName(user.getUserName());
            rh.setUserPassword(user.getUserPassword());
            rh.setRole(Roles.RH.name());
            rh.setTel(user.getTel());
            rh.setEmail(user.getEmail());
            rh.setUserPrenom(user.getUserPrenom());

            userRepository.deleteById(user.getUserId());

            rhRepositorie.save(rh);

            UserRequest rhRequest = new UserRequest();
            rhRequest.setUserId(rh.getUserId());
            rhRequest.setUserName(rh.getUserName());
            rhRequest.setUserPassword(rh.getUserPassword());
            rhRequest.setRole(rh.getRole());

            notificationService.notifyNewRh(rhRequest);

            return "User changed from EMPLOYER to RH: " + rh.getUserName();
        }

        user.setRole(role.name());
        userRepository.save(user);

        return "Role " + role.name() + " attributed to user " + user.getUserName();
    }

    @Override
    @Transactional
    public void createAdmin() {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUserName(adminName);
            admin.setUserPassword(passwordUtils.hashPassword(adminPassword)); 
            admin.setRole(Roles.ADMIN.name());
            admin.setEmail("admin@admin.com");
            admin.setTel("00000000");
            admin.setUserPrenom("Admin");
            
            adminRepository.save(admin);

            admin.setRh(admin);
            rhRepositorie.save(admin);
            
            UserRequest adminRequest = new UserRequest();
            adminRequest.setUserId(admin.getUserId());
            adminRequest.setUserName(admin.getUserName());
            adminRequest.setUserPassword(admin.getUserPassword());
            adminRequest.setRole(admin.getRole());
            adminRequest.setEmail(admin.getEmail());
            adminRequest.setTel(admin.getTel());
            adminRequest.setUserPrenom(admin.getUserPrenom());

            notificationService.notifyNewRh(adminRequest);

            EmployerResult employerRequest = new EmployerResult();
            employerRequest.setUserId(admin.getUserId());
            employerRequest.setUserName(admin.getUserName());
            employerRequest.setUserPassword(admin.getUserPassword());
            employerRequest.setRole(admin.getRole());
            employerRequest.setRhId(admin.getUserId());

            notificationService.notifyNewEmployer(employerRequest);
        }
    }
}