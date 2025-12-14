package com.erp.tache_service.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erp.tache_service.models.Employer;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, UUID> {
    public Optional<Employer> findByEmail(String email);
}
