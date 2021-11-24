package com.example.mdtapi.models;

import javax.persistence.*;

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

    private boolean leader;

    private Integer tag;

    public Employee() {
    }

    public Employee(Integer id, Person person, Department department, Rank rank, boolean leader, Integer tag) {
        this.id = id;
        this.person = person;
        this.department = department;
        this.rank = rank;
        this.leader = leader;
        this.tag = tag;
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

    public Integer getDepartment() {
        return department.getCode();
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

    public boolean isLeader() {
        return leader;
    }

    public void setLeader(boolean leader) {
        this.leader = leader;
    }

    public Integer getTag() {
        return tag;
    }

    public void setTag(Integer tag) {
        this.tag = tag;
    }
}
