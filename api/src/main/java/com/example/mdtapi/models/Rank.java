package com.example.mdtapi.models;

import javax.persistence.*;

@Entity
public class Rank {

    private @Id String title;
    private Short salary;

    @ManyToOne(targetEntity = Department.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "department_code")
    private Department department;

    public Rank() {
    }

    public Rank(String title, Short salary, Department department) {
        this.title = title;
        this.salary = salary;
        this.department = department;
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

    public Integer getDepartment() {
        return (department == null) ? -1 : department.getCode();
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}
