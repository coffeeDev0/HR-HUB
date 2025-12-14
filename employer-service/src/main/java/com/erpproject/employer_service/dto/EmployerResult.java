package com.erpproject.employer_service.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class EmployerResult {
    private UUID userId;
    private String userName;
    private String userPassword;
    private String email;
    private String tel;
    private String userPrenom;
    private UUID rhId;
    private String role;
    private String profession;
    private String status;

}