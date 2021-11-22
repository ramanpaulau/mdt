package com.example.mdtapi.models;

import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
public class Rank {

    private @Id String title;
    private Short salary;

    @ManyToOne(targetEntity = Department.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "department_code")
    private Department department;

    @Column(name = "department_code", insertable = false, updatable = false)
    private Integer departmentCode;

    public Rank() {
    }

    public Rank(String title, Short salary, Department department) {
        this.title = title;
        this.salary = salary;
        this.department = department;
        this.departmentCode = department.getCode();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Short getSalary() {
        return salary;
    }

    public void setSalary(Short salary) {
        this.salary = salary;
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
}
