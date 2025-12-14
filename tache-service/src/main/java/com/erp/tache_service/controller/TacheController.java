package com.erp.tache_service.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.erp.tache_service.dto.EmployerResult;
import com.erp.tache_service.dto.TacheRequest;
import com.erp.tache_service.dto.TacheResult;
import com.erp.tache_service.services.TacheService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/taches")
@RequiredArgsConstructor
public class TacheController {

    private final TacheService tacheService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Récupère toutes les tâches")
    public List<TacheResult> getAllTaches() {
        return tacheService.getAllTaches();
    }

    @GetMapping("/employer/{email}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Récupère les tâches assignées à un employé")
    public List<TacheResult> getTachesByEmployer(@PathVariable String email) {
        return tacheService.getTachesByEmployer(email);
    }

    @GetMapping("/rh/{email}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Récupère les tâches créées par un RH ")
    public List<TacheResult> getTachesByRh(@PathVariable String email) {
        return tacheService.getTachesByRh(email);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crée une nouvelle tâche")
    public TacheResult createTache(@RequestBody TacheRequest tacheRequest) {
        return tacheService.createTache(tacheRequest);
    }

    @PutMapping("/{tacheId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Meise à jour une tâche existante")
    public TacheResult updateTache(@PathVariable UUID tacheId, @RequestBody TacheRequest tacheRequest) {
        return tacheService.updateTache(tacheId, tacheRequest);
    }

    @DeleteMapping("/{tacheId}")
    @Operation(summary = "Suppression d'une tache par son id'")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTache(@PathVariable UUID tacheId) {
        tacheService.deleteTache(tacheId);
    }

    @GetMapping("/tache/{tacheId}")
    @Operation(summary = "get les employer qui travaillent sur une tache")
    @ResponseStatus(HttpStatus.OK)
    public List<EmployerResult> getEmployerByTache(@PathVariable UUID tacheId) {
        return tacheService.getAllEmployerByTache(tacheId);
    }
    
}