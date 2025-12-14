package com.erpproject.conge_service.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.erpproject.conge_service.models.Rh;

@Repository
public interface RhRepositorie extends JpaRepository<Rh, UUID> {
    
    
    
}