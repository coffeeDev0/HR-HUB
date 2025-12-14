package com.erpproject.employer_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erpproject.employer_service.models.Employer;

@Repository
public interface EmployerRepositorie extends JpaRepository<Employer, UUID> {
    List<Employer> findByRh_UserId(UUID rhId);

}