package com.example.mdtapi.models;

import javax.persistence.*;

@Entity
public class Unit {

    private @Id String abbreviation;
    private String title;
    private String description;

    @ManyToOne(targetEntity = Department.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "department_code")
    private Department department;

    public Unit() {
    }

    public Unit(String abbreviation, String title, String description) {
        this.abbreviation = abbreviation;
        this.title = title;
        this.description = description;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDepartment() {
        return (department == null) ? -1 : department.getCode();
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}
