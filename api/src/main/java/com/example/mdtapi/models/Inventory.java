package com.example.mdtapi.models;

import javax.persistence.*;

@Entity
public class Inventory {
    private @Id String description;
    private Integer amount;

    @OneToOne(targetEntity = Department.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "department_code")
    private Department department;

    public Inventory() {
    }

    public Inventory(String description, Integer amount, Department department) {
        this.description = description;
        this.amount = amount;
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Integer getDepartment() {
        return department.getCode();
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    @Override
    public String toString() {
        return "Inventory{" +
                "description='" + description + '\'' +
                ", amount=" + amount +
                ", department=" + department +
                '}';
    }
}
