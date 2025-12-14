package com.erp.tache_service.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.erp.tache_service.dto.FichierRequest;
import com.erp.tache_service.dto.FichierResult;
import com.erp.tache_service.services.FichierService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/fichiers")
@RequiredArgsConstructor
public class FichierController {

    private final FichierService fichierService;

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un fichier par ID")
    @ResponseStatus(HttpStatus.OK)
    public FichierResult getFileById(@PathVariable("id") Long fileId) {
        return fichierService.getFileById(fileId);
    }

    @GetMapping("/all")
    @Operation(summary = "Afficher tous les fichiers")
    @ResponseStatus(HttpStatus.OK)
    public List<FichierResult> getAllFichier() {
        return fichierService.getAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Uploader un fichier",
        description = "Upload un fichier et l'associe à une tâche"
    )
    @ApiResponse(
        responseCode = "201",
        description = "Fichier uploadé avec succès",
        content = @Content(schema = @Schema(implementation = FichierResult.class))
    )
    @ResponseStatus(HttpStatus.CREATED)
    public FichierResult uploadFile(
            @Parameter(description = "Fichier à uploader", required = true)
            @RequestParam("file") MultipartFile file,
            
            @Parameter(description = "ID de la tâche associée", required = true)
            @RequestParam("tacheId") UUID tacheId,
            @Parameter(description = "ID de l'employer qui l'a envoyer", required = true)
            @RequestParam("employerId") UUID employerId) throws IOException {


        FichierRequest fichierRequest = new FichierRequest();
        fichierRequest.setFile(file);
        fichierRequest.setTacheId(tacheId);
        fichierRequest.setEmployerId(employerId);
        
        return fichierService.uploadFile(fichierRequest);
    }

    @GetMapping("/download/{id}")
    @Operation(
        summary = "Télécharger/Afficher un fichier",
        description = "Récupère le fichier physique pour l'afficher ou le télécharger"
    )
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(
            @PathVariable("id") Long fileId) {
        return fichierService.downloadFile(fileId);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un fichier")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFile(@PathVariable("id") Long fileId) {
        fichierService.deleteFile(fileId);
    }
}