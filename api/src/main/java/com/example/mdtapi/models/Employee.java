package com.example.mdtapi.models;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Employee {
    private @Id @GeneratedValue Integer id;

    @OneToOne(targetEntity = Person.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "person_regNum")
    private Person person;

    @ManyToOne(targetEntity = Department.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "department_code")
    private Department department;

    @ManyToOne(targetEntity = Rank.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "rank_title")
    private Rank rank;

    @ManyToOne(targetEntity = Unit.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "unit_abbreviation")
    private Unit unit;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "employee_qualification",
            joinColumns = { @JoinColumn(name = "qualification_id") },
            inverseJoinColumns = { @JoinColumn(name = "employee_id") }
    )
    private Set<Qualification> qualifications = new HashSet<>();

    private Integer tag;

    @Transient
    private String marking;

    public Employee() {
    }

    public Employee(Integer id, Person person, Department department, Rank rank, Unit unit, Set<Qualification> qualifications, Integer tag, String marking) {
        this.id = id;
        this.person = person;
        this.department = department;
        this.rank = rank;
        this.unit = unit;
        this.qualifications = qualifications;
        this.tag = tag;
        this.marking = marking;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPerson() {
        return person.getRegNum();
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public String getFullName() {
        return person.getFullName();
    }

    public Integer getDepartment() {
        return department.getCode();
    }

    public String getDepartmentTitle() {
        return department.getShortTitle();
    }

    public String getDepartmentFullTitle() {
        return department.getTitle();
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public String getRank() {
        return rank.getTitle();
    }

    public void setRank(Rank rank) {
        this.rank = rank;
    }

    public Unit getUnit() {
        return unit;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public Short getSalary() {
        return rank.getSalary();
    }

    public Set<Qualification> getQualifications() {
        return qualifications;
    }

    public void setQualifications(Set<Qualification> qualifications) {
        this.qualifications = qualifications;
    }

    public Integer getTag() {
        return tag;
    }

    public void setTag(Integer tag) {
        this.tag = tag;
    }

    public boolean isLeader() {
        return this.department.getLeader().equals(this.id);
    }

    public String getMarking() {
        return department.getCode() + ((unit != null) ? unit.getAbbreviation() : department.getUnit()) + "-" + getTag();
    }
}
