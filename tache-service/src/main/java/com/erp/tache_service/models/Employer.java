package com.erp.tache_service.models;

import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Entity
@Data
public class Employer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID employerId;
    
    @Column(name = "email", nullable = false,unique = true)
    private String email;

    @ManyToMany(mappedBy = "employers")
    private java.util.List<Taches> taches;


}
