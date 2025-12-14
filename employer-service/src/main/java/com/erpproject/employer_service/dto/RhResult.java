package com.erpproject.employer_service.dto;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class RhResult {
    private UUID id;

    private String userName;

    private String userPassword;

    private String role;
    
    
    private List<EmployerResult> employers;
    
    private UUID rhId;
    
}