package com.example.mdtapi.models;

import javax.persistence.*;
import java.util.Date;

@Entity
public class History {
    private @Id Date date = new Date();
    private String description;
    private Integer amount;
    private Boolean action;

    @ManyToOne(targetEntity = Department.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "department_code")
    private Department department;

    @ManyToOne(targetEntity = Employee.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    public History() {
    }

    public History(Date date, String description, Integer amount, Boolean action, Department department, Employee employee) {
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.action = action;
        this.department = department;
        this.employee = employee;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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

    public Boolean getAction() {
        return action;
    }

    public void setAction(Boolean action) {
        this.action = action;
    }

    public Integer getDepartment() {
        return department.getCode();
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public String getEmployee() {
        return employee.getMarking();
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
