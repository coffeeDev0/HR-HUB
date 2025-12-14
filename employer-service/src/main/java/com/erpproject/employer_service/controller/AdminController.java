package com.erpproject.employer_service.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.services.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.Data;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/admin")
@Data
public class AdminController {
    private final AdminService adminService;

    @Operation(summary = "attribuer un role a un user")
    @PostMapping("attribute/{id}")
    public String attributUserRole(@PathVariable UUID id, @RequestBody Roles role) {

        return adminService.attributRole(id, role);
    }
}
