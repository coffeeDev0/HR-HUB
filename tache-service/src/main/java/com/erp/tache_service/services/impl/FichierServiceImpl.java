package com.erp.tache_service.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.erp.tache_service.dto.FichierRequest;
import com.erp.tache_service.dto.FichierResult;
import com.erp.tache_service.mapper.FichierMapper;
import com.erp.tache_service.models.Fichier;
import com.erp.tache_service.repository.FichierRepository;
import com.erp.tache_service.services.FichierService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FichierServiceImpl implements FichierService {

    private final FichierRepository fichierRepository;
    private final FichierMapper fichierMapper;

    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "doc", "docx", "xls", "xlsx", "txt", "jpg", "jpeg", "png", "gif");

    @Override
    public FichierResult uploadFile(FichierRequest fichierRequest) throws IOException {

        MultipartFile file = fichierRequest.getFile();

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidFileExtension(originalFilename)) {
            throw new IllegalArgumentException("Type de fichier non autorisé");
        }

        long maxFileSize = 10 * 1024 * 1024;
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("Le fichier est trop volumineux (max 10MB)");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("Répertoire créé: {}", uploadDir);
        }

        Fichier fichier = fichierMapper.toEntity(fichierRequest);

        fichier.setFileSize(file.getSize());
        fichier.setContentType(file.getContentType());
        fichier.setExtension(getFileExtension(originalFilename));

        Fichier fichierEnregistre = fichierRepository.save(fichier);

        String sanitizedFilename = sanitizeFilename(originalFilename);
        String uniqueFilename = fichierEnregistre.getId() + "_" + System.currentTimeMillis() + "_" + sanitizedFilename;
        String filePath = uploadDir + uniqueFilename;

        fichierEnregistre.setUrl(filePath);
        fichierRepository.save(fichierEnregistre);

        try {
            Files.copy(file.getInputStream(), Paths.get(filePath), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            log.info("Fichier uploadé avec succès: {}", filePath);
        } catch (IOException e) {

            fichierRepository.delete(fichierEnregistre);
            log.error("Erreur lors de l'upload du fichier", e);
            throw new IOException("Erreur lors de l'enregistrement du fichier", e);
        }

        return fichierMapper.toDto(fichierEnregistre);
    }

    @Override
    public FichierResult getFileById(Long fileId) {
        return fichierMapper.toDto(
                fichierRepository.findById(fileId)
                        .orElseThrow(() -> new RuntimeException("Fichier non trouvé avec l'ID: " + fileId)));
    }

    @Override
    public void deleteFile(Long fileId) {
        Fichier fichier = fichierRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Fichier non trouvé avec l'ID: " + fileId));

        try {
            Path filePath = Paths.get(fichier.getUrl());
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.info("Fichier supprimé: {}", fichier.getUrl());
            } else {
                log.warn("Fichier non trouvé sur le disque: {}", fichier.getUrl());
            }
        } catch (IOException e) {
            log.error("Erreur lors de la suppression du fichier: {}", fichier.getUrl(), e);

        }

        fichierRepository.delete(fichier);
        log.info("Entrée de fichier supprimée de la base de données: {}", fileId);
    }

    @Override
    public List<FichierResult> getAll() {
        return fichierRepository.findAll().stream()
                .map(fichierMapper::toDto)
                .toList();
    }

    @Override
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> downloadFile(Long fileId) {
        try {

            Fichier fichier = fichierRepository.findById(fileId)
                    .orElseThrow(() -> new RuntimeException("Fichier non trouvé avec l'ID: " + fileId));

            Path filePath = Paths.get(fichier.getUrl());
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Fichier introuvable ou illisible: " + fichier.getName());
            }

            String contentType = fichier.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            log.info("Téléchargement du fichier: {}", fichier.getName());

            return org.springframework.http.ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + fichier.getName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            log.error("Erreur lors du téléchargement du fichier", e);
            throw new RuntimeException("Erreur lors du téléchargement du fichier: " + e.getMessage());
        }
    }

    private boolean isValidFileExtension(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(extension);
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex + 1);
        }
        return "";
    }

    private String sanitizeFilename(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}