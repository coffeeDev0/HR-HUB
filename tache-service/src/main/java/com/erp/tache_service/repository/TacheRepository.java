package com.erp.tache_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erp.tache_service.models.Taches;

@Repository
public interface TacheRepository extends JpaRepository<Taches, UUID> {
    List<Taches> findByEmployers_Email(String email);
    List<Taches> findByRhEmail(String email);
}
