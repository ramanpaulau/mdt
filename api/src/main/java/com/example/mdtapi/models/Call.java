package com.example.mdtapi.models;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Call {
    private @Id @GeneratedValue Integer id;
    private String text;
    private String location;
    private String phone;
    private LocalDateTime time = LocalDateTime.now();

    @OneToOne(targetEntity = Incident.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_id")
    private Incident incident;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "call_officers",
            joinColumns = { @JoinColumn(name = "call_id") },
            inverseJoinColumns = { @JoinColumn(name = "employee_id") }
    )
    private Set<Employee> employees = new HashSet<>();

    public Call() {
    }

    public Call(Integer id, String text, String location, String phone, LocalDateTime time, Incident incident, Set<Employee> employees) {
        this.id = id;
        this.text = text;
        this.location = location;
        this.phone = phone;
        this.time = time;
        this.incident = incident;
        this.employees = employees;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public Integer getIncidentId() {
        return (incident == null) ? 0 : incident.getId();
    }

    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }
}
