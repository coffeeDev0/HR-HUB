package com.erpproject.employer_service.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class UserRequest {
    private UUID userId;
    private String userName;
    private String userPassword;
    private String role;
    private String email;
    private String userPrenom;
    private String tel;
    private String profession;
    private String status;
}
