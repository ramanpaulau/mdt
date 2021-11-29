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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "active_officers",
            joinColumns = @JoinColumn(name = "incident_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id"))
    private Set<Employee> officers = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "bolo_persons",
            joinColumns = @JoinColumn(name = "incident_id"),
            inverseJoinColumns = @JoinColumn(name = "person_reg_num"))
    private Set<Person> boloPersons = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "bolo_vehicles",
            joinColumns = @JoinColumn(name = "incident_id"),
            inverseJoinColumns = @JoinColumn(name = "vehicle_plate_num"))
    private Set<Vehicle> boloVehicles = new HashSet<>();


    @OneToMany(targetEntity = Indictment.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_id")
    private Set<Indictment> indictments = new HashSet<>();

    public Incident() {
    }

    public Incident(Integer id, String title, String location, LocalDateTime dateTime, String details, Employee supervisor, Set<Employee> officers, Set<Person> boloPersons, Set<Vehicle> boloVehicles, Set<Indictment> indictments) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.dateTime = dateTime;
        this.details = details;
        this.supervisor = supervisor;
        this.officers = officers;
        this.boloPersons = boloPersons;
        this.boloVehicles = boloVehicles;
        this.indictments = indictments;
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

    public Set<Person> getBoloPersons() {
        return boloPersons;
    }

    public void setBoloPersons(Set<Person> boloPersons) {
        this.boloPersons = boloPersons;
    }

    public Set<Vehicle> getBoloVehicles() {
        return boloVehicles;
    }

    public void setBoloVehicles(Set<Vehicle> boloVehicles) {
        this.boloVehicles = boloVehicles;
    }

    public Set<Indictment> getIndictments() {
        return indictments;
    }

    public void setIndictments(Set<Indictment> indictments) {
        this.indictments = indictments;
    }
}
