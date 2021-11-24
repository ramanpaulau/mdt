package com.example.mdtapi.models;

import javax.persistence.*;

@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"shortTitle"})})
public class Department {
    private @Id @GeneratedValue Integer code;
    private String shortTitle;
    private String title;
    private String description;

    @OneToOne(targetEntity = Person.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "person_regNum")
    private Person leader;

    @OneToOne(targetEntity = Unit.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "unit_abbreviation")
    private Unit unit;

    public Department() {
    }

    public Department(Integer code, String shortTitle, String title, String description) {
        this.code = code;
        this.shortTitle = shortTitle;
        this.title = title;
        this.description = description;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getShortTitle() {
        return shortTitle;
    }

    public void setShortTitle(String shortTitle) {
        this.shortTitle = shortTitle;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLeader() {
        return (leader == null) ? "" : leader.getRegNum();
    }

    public void setLeader(Person leader) {
        this.leader = leader;
    }

    public String getUnit() {
        return (unit == null) ? "" : unit.getAbbreviation();
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }
}
