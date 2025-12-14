package com.erp.tache_service.models;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Rh {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID rhId;
    
    @Column(name = "email", nullable = false,unique = true)
    private String email;

    @OneToMany(mappedBy = "rh", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Taches> taches;

}
