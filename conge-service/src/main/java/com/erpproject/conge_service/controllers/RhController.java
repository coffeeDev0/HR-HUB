package com.erpproject.conge_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.conge_service.dto.RhRequest;
import com.erpproject.conge_service.models.Rh;
import com.erpproject.conge_service.repositories.RhRepositorie;
import org.springframework.web.bind.annotation.CrossOrigin;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/conge-rh/")
public class RhController {
    @Autowired
    private RhRepositorie rhRepositorie;

    @PostMapping("/add")
    public ResponseEntity<RhRequest> postMethodName(@RequestBody RhRequest rhRequest) {
        try {
            Rh rh = new Rh();
            rh.setUserName(rhRequest.getUserName());
            rh.setUserPassword(rhRequest.getUserPassword());
            rh.setRole(rhRequest.getRole());
            rh.setUserId(rhRequest.getUserId());

            rhRepositorie.save(rh);
            return ResponseEntity.ok(rhRequest);
        } catch (Exception e) {
            // Log l'erreur pour debug
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }   
    }
    
    @GetMapping("/all")
    public ResponseEntity<java.util.List<Rh>> getAllRhs() {
        return ResponseEntity.ok(rhRepositorie.findAll());
    }
}
