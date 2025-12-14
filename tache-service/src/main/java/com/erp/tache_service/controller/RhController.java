package com.erp.tache_service.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;

import com.erp.tache_service.dto.RhRequest;
import com.erp.tache_service.dto.RhResult;
import com.erp.tache_service.models.Rh;
import com.erp.tache_service.services.RhService;

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
import org.springframework.web.bind.annotation.PutMapping;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/rhs")
public class RhController {

    private final RhService rhService;

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new RH")
    public Rh createRh(@RequestBody RhRequest rhRequest) {
        return rhService.createRh(rhRequest);
    }

    @GetMapping("/{email}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get RH by email")
    public RhResult getRhByEmail(@PathVariable String email) {
        return rhService.getRhByEmail(email);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all rh")
    @ResponseStatus(HttpStatus.OK)
    public List<RhResult> getAllRh() {
        return rhService.getAllRhs();
    }

    @PutMapping("attribution/{tacheId}")
    @Operation(summary = "attribuer des taches a un ou plusieurs employes")
    @ResponseStatus(HttpStatus.OK)
    public void attributTacheToEmployers(@PathVariable UUID tacheId, @RequestBody List<UUID> employersId) {
        rhService.confiTache(tacheId, employersId);
    }

    @PostMapping("evalue/{tacheId}")
    @Operation(summary = "evaluer une tache")
    @ResponseStatus(HttpStatus.OK)
    public Boolean postMethodName(@PathVariable UUID tacheId, @RequestBody Boolean avis) {
        return rhService.validerTache(tacheId, avis);
    }


}
