package com.erp.tache_service.dto;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class RhResult {
    private UUID rhId;
    private String email;
    private List<TacheResult> taches;
}
