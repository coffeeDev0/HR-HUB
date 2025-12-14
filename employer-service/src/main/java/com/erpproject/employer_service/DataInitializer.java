package com.erpproject.employer_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import com.erpproject.employer_service.services.AdminService;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminService adminService;

    @Override
    public void run(String... args) {
        adminService.createAdmin();
    }
}
