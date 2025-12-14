package com.erp.tache_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erp.tache_service.models.Fichier;

@Repository
public interface FichierRepository extends JpaRepository <Fichier, Long> {
    
}
