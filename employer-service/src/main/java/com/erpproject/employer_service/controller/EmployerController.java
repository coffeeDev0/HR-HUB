package com.erpproject.employer_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.employer_service.communication.NotificationService;
import com.erpproject.employer_service.dto.EmployerRequest;
import com.erpproject.employer_service.dto.EmployerResult;
import com.erpproject.employer_service.services.EmployerService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/employer")
public class EmployerController {

    private final EmployerService employerService;
    private final NotificationService notificationService;

    @Operation(summary = "ajout d'un employer")
    @PostMapping("/add")
    public ResponseEntity<EmployerResult> addEmployer(@Valid @RequestBody EmployerRequest employerRequest) {
        try {
            EmployerResult newEmployer = employerService.createAndNotifyEmployer(employerRequest);
            notificationService.notifyNewEmployer(newEmployer);
            return ResponseEntity.ok(newEmployer);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid employer data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error creating employer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "afficher tout les rh")
    @GetMapping("/all")
    public ResponseEntity<List<EmployerResult>> getEmployers() {
        List<EmployerResult> employers = employerService.findAllEmployer();
        return ResponseEntity.ok(employers);
    }

}
