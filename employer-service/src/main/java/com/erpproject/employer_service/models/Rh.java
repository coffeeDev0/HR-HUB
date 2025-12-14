package com.erpproject.employer_service.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "rh")
public class Rh extends Employer {

    public Rh(){
        super();
        setRole(Roles.RH.name());
    }
    @OneToMany
    private List<Employer> employers;
}