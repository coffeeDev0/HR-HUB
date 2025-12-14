package com.erp.tache_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.erp.tache_service.dto.EmployerRequest;
import com.erp.tache_service.dto.EmployerResult;
import com.erp.tache_service.models.Employer;
import com.erp.tache_service.services.EmployerService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/Employers")
public class EmployerController {

    private final EmployerService EmployerService;

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new Employer")
    public Employer createEmployer(@RequestBody EmployerRequest EmployerRequest) {
        return EmployerService.createEmployer(EmployerRequest);
    }

    @GetMapping("/{email}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get Employer by email")
    public EmployerResult getEmployerByEmail(@PathVariable String email) {
        return EmployerService.getEmployerByEmail(email);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all Employer")
    @ResponseStatus(HttpStatus.OK)
    public List<EmployerResult> getAllEmployer() {
        return EmployerService.getAllEmployers();
    }

}
