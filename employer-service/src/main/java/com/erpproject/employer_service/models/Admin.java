package com.erpproject.employer_service.models;

import jakarta.persistence.Entity;

@Entity
public class Admin extends Rh {
    public Admin() {
        super();
        setRole(Roles.ADMIN.name());
    }
}
