package com.example.mdtapi.models;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Indictment {
    private @Id @GeneratedValue Integer id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @OneToOne(targetEntity = Department.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "department_code")
    private Department department;

    /*@OneToOne(targetEntity = Incident.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_id")
    private Incident incident;*/

    @OneToOne(targetEntity = Person.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "person_regNum")
    private Person person;

    @OneToOne(targetEntity = Employee.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String laws;

    public Indictment() {
    }

    public Indictment(Integer id, LocalDateTime startTime, LocalDateTime endTime, Department department, Person person, Employee employee, String laws) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.department = department;
        this.person = person;
        this.employee = employee;
        this.laws = laws;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getDepartment() {
        return department.getShortTitle();
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    /*public Integer getIncident() {
        return incident.getId();
    }

    public void setIncident(Incident incident) {
        this.incident = incident;
    }*/

    public String getPerson() {
        return person.getRegNum();
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public String getEmployee() {
        return employee.getMarking();
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getLaws() {
        return laws;
    }

    public void setLaws(String laws) {
        this.laws = laws;
    }
}
