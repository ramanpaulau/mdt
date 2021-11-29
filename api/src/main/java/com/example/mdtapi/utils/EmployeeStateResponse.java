package com.example.mdtapi.utils;

import com.example.mdtapi.models.Employee;

public class EmployeeStateResponse {
    private String action;
    private Employee employee;
    private String state;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Employee getEmployee() {
        return employee;
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
