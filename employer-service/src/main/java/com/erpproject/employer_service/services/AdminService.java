package com.erpproject.employer_service.services;

import java.util.UUID;

import com.erpproject.employer_service.models.Roles;

public interface AdminService {

    public String attributRole(UUID id, Roles role);

    public void createAdmin();
}
