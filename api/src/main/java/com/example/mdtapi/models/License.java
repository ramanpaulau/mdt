package com.example.mdtapi.models;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class License {
    private @Id @GeneratedValue Integer id;
    private String name;
    private String details;

    @ManyToMany(mappedBy = "licenses")
    private Set<Person> persons = new HashSet<>();

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
}
