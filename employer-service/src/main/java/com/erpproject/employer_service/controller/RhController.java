package com.erpproject.employer_service.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.employer_service.dto.EmployerRequest;
import com.erpproject.employer_service.dto.EmployerResult;
import com.erpproject.employer_service.dto.RhResult;
import com.erpproject.employer_service.services.RhService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/rh")
public class RhController {

    private final RhService rhService;

    @Operation(summary = "ajout d'un rh")
    @PostMapping("/add")
    public ResponseEntity<RhResult> createRh(@RequestBody EmployerRequest rh) {

        RhResult createdRh = rhService.createRh(rh);
        return ResponseEntity.ok(createdRh);
    }

    @Operation(summary = "afficher tout les rh")
    @GetMapping("/all")
    public ResponseEntity<List<RhResult>> findAllRh() {
        List<RhResult> rhResults = rhService.findAllRh();
        return ResponseEntity.ok(rhResults);
    }

    @Operation(summary = "afficher les employer d'un rh")
    @GetMapping("/{rhId}")
    public List<EmployerResult> getMethodName(@PathVariable UUID rhId) {
        return rhService.findAllEmployer(rhId);
    }

    @Operation(summary = "update status employer")
    @PutMapping("update/{userId}")
    public String updateStatus(@PathVariable UUID userId, @RequestBody String Status) {
        return rhService.updateStatus(userId, Status);
    }

}
