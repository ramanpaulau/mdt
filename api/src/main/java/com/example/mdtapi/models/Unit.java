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

    @Column(name = "department_code", insertable = false, updatable = false)
    private Integer departmentCode;

    public Unit() {
    }

    public Unit(String abbreviation, String title, String description, Integer departmentCode) {
        this.abbreviation = abbreviation;
        this.title = title;
        this.description = description;
        this.departmentCode = departmentCode;
    }

    public Unit(String abbreviation, String title, String description, Department department, Integer departmentCode) {
        this.abbreviation = abbreviation;
        this.title = title;
        this.description = description;
        this.department = department;
        this.departmentCode = departmentCode;
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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Integer getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(Integer departmentCode) {
        this.departmentCode = departmentCode;
    }

    @Override
    public String toString() {
        return "Unit{" +
                "abbreviation='" + abbreviation + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", department=" + department +
                ", departmentCode=" + departmentCode +
                '}';
    }
}
