package com.erpproject.conge_service.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class EmployerRequest {
    private UUID userId ;
    private String userName;
    private String userPassword;
    private UUID rhId;
    private String role;
}