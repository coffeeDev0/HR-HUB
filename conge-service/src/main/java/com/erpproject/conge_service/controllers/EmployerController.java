package com.erpproject.conge_service.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.conge_service.dto.EmployerRequest;
import com.erpproject.conge_service.models.Employer;
import com.erpproject.conge_service.models.Rh;
import com.erpproject.conge_service.repositories.EmployerRepositorie;
import com.erpproject.conge_service.repositories.RhRepositorie;
import com.erpproject.conge_service.services.EmployerService;
import org.springframework.web.bind.annotation.CrossOrigin;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/conge-employer/")
public class EmployerController {
    
    @Autowired
    private EmployerRepositorie employerRepositorie;
    
    @Autowired
    private RhRepositorie rhRepositorie;

    @Autowired
    private EmployerService employerService;
    
    @PostMapping("/add")
    public ResponseEntity<EmployerRequest> addEmployer(@RequestBody EmployerRequest employerRequest) {
        try {
            Optional<Rh> rhOpt = rhRepositorie.findById(employerRequest.getRhId());
            if (rhOpt.isEmpty()) { 
                return ResponseEntity.badRequest().build();
            }

            Employer employer = new Employer();
            employer.setUserId(employerRequest.getUserId());
            employer.setUserName(employerRequest.getUserName());
            employer.setUserPassword(employerRequest.getUserPassword());
            employer.setRh(rhOpt.get());
            employer.setRole(employerRequest.getRole());
            
            employerRepositorie.save(employer);
            return ResponseEntity.ok(employerRequest);
            
        } catch (Exception e) {
            // Log l'erreur pour debug
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Récupérer tous les employés avec leur RH
    @GetMapping("/all")
    public ResponseEntity<List<EmployerRequest>> getAllEmployers() {
        return ResponseEntity.ok(employerService.findAllEmployer());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Optional<EmployerRequest>> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(employerService.findByEmail(email));
    }
    
}
