package com.erpproject.conge_service.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class RhRequest {
    private UUID userId;
    private String userName;
    private String userPassword;
    private String role;
}
