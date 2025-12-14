package com.erp.tache_service.services;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.erp.tache_service.dto.FichierRequest;
import com.erp.tache_service.dto.FichierResult;

@Service
public interface FichierService {

    public List<FichierResult> getAll();

    public FichierResult uploadFile(FichierRequest fichierRequest) throws IOException;

    public FichierResult getFileById(Long fileId);

    public void deleteFile(Long fileId);

    ResponseEntity<org.springframework.core.io.Resource> downloadFile(Long fileId);
}
