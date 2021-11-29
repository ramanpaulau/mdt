package com.example.mdtapi.models;

import javax.persistence.*;

@Entity
public class EmployeeState {
    private @Id @GeneratedValue Integer id;

    @OneToOne(targetEntity = Employee.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String state;

    public EmployeeState() {
    }

    public EmployeeState(Employee employee, String state) {
        this.employee = employee;
        this.state = state;
    }

    public Employee getEmployee() {
        return employee;
    }

    public String getName() {
        return employee.getFullName();
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
