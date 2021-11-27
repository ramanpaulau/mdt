package com.example.mdtapi.models;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Incident {
    private @Id @GeneratedValue Integer id;
    private String title;
    private String location;
    private LocalDateTime dateTime;
    private String details;

    @ManyToOne(targetEntity = Employee.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee supervisor;

    @ManyToMany
    @JoinTable(
            name = "active_officers",
            joinColumns = @JoinColumn(name = "incident_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id"))
    private Set<Employee> officers = new HashSet<>();

    public Incident() {
    }

    public Incident(Integer id, String title, String location, LocalDateTime dateTime, String details, Employee supervisor, Set<Employee> officers) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.dateTime = dateTime;
        this.details = details;
        this.supervisor = supervisor;
        this.officers = officers;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getSupervisor() {
        return supervisor.getMarking();
    }

    public void setSupervisor(Employee supervisor) {
        this.supervisor = supervisor;
    }

    public Set<Employee> getOfficers() {
        return officers;
    }

    public void setOfficers(Set<Employee> officers) {
        this.officers = officers;
    }
}