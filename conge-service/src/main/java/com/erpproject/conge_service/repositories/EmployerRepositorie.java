package com.erpproject.conge_service.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erpproject.conge_service.models.Employer;

@Repository
public interface EmployerRepositorie extends JpaRepository<Employer, UUID> {
    
    Optional<Employer> findByUserName(String userName);
    
    boolean existsByUserName(String userName);
    
    List<Employer> findByRole(String role);
    
    List<Employer> findByRhUserId(UUID rhUserId);
}