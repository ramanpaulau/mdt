package com.example.mdtapi.models;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class License {
    private @Id @GeneratedValue Integer id;
    private String name;
    private String details;

    public License() {
    }

    public License(String name, String details) {
        this.name = name;
        this.details = details;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        License license = (License) o;
        return Objects.equals(id, license.id) && Objects.equals(name, license.name) && Objects.equals(details, license.details);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, details);
    }
}
