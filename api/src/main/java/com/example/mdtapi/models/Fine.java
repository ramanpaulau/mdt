package com.example.mdtapi.models;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Fine {
    private @Id @GeneratedValue Integer id;

    private Integer amount;

    private String laws;

    @ManyToOne(targetEntity = Employee.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(targetEntity = Person.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "person_regNum")
    private Person person;

    private Boolean state = false;

    private Date date = new Date();

    public Fine() {
    }

    public Fine(Integer id, Integer amount, String laws, Employee employee, Person person, Boolean state, Date date) {
        this.id = id;
        this.amount = amount;
        this.laws = laws;
        this.employee = employee;
        this.person = person;
        this.state = state;
        this.date = date;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getLaws() {
        return laws;
    }

    public void setLaws(String laws) {
        this.laws = laws;
    }

    public String getEmployee() {
        return (employee != null)?employee.getMarking():"";
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getPerson() {
        return (person != null)?person.getRegNum():"";
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
