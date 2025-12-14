package com.erp.tache_service.dto;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class EmployerResult {
    private UUID employerId;
    private String email;
    private List<TacheResult> taches;
}
