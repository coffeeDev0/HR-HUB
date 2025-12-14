package com.erpproject.employer_service.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmployerRequest {
    @NotNull
    private String userName;
    @NotNull
    private String userPassword;
    @NotNull
    private UUID rhId;
    @NotNull
    private String email;
    private String tel;
    private String userPrenom;
    private String profession;
    private String status;

}