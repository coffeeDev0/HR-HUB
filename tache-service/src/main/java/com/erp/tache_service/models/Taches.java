package com.erp.tache_service.models;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Taches {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID tacheId;

    @Column(nullable = false)
    private String nomTache;

    @Column(name = "description", nullable = false) 
    private String description;

    @Column(name = "priorite")
    private Integer priorite = 1;

    @Column(name = "etat")
    private String etat = "EN COURS"; 
    
    @Column(name = "date_debut")
    private Date dateDebut = new Date(System.currentTimeMillis());
    
    @Column(name = "date_fin", nullable = false) 
    private Date dateFin;

    @ManyToOne
    @JoinColumn(name = "rh_id", nullable = false)
    private Rh rh;

    @ManyToMany
    @JoinTable(
        name = "tache_employers",
        joinColumns = @JoinColumn(name = "tache_id"),
        inverseJoinColumns = @JoinColumn(name = "employer_id")
    )
    private List<Employer> employers;

    @OneToMany(mappedBy = "tache")
    private List<Fichier> fichiers = new ArrayList<>();

}

