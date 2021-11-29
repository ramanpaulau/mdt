package com.example.mdtapi.models;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class WorkHours {

    private @Id @GeneratedValue Integer id;

    @OneToOne(targetEntity = Employee.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Short salary;

    public WorkHours() {
    }

    public WorkHours(Integer id, Employee employee, LocalDateTime startTime, LocalDateTime endTime, Short salary) {
        this.id = id;
        this.employee = employee;
        this.startTime = startTime;
        this.endTime = endTime;
        this.salary = salary;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Short getSalary() {
        return salary;
    }

    public void setSalary(Short salary) {
        this.salary = salary;
    }
}
