package com.erpproject.employer_service.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erpproject.employer_service.models.Admin;

public interface AdminRepository extends JpaRepository<Admin, UUID> {

}
