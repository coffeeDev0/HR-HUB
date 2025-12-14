package com.erp.tache_service.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erp.tache_service.models.Rh;

@Repository
public interface RhRepositoty extends JpaRepository <Rh,UUID> {
    public Optional<Rh> findByEmail(String email);
}
