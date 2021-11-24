package com.example.mdtapi.models;

import org.apache.tomcat.jni.Local;

import java.time.LocalDate;

public class PersonMessage {
    private String regNum;
    private String name;
    private String surname;
    private String phoneNumber;
    private LocalDate birthdate;
    private Person.State state;

    public String getRegNum() {
        return regNum;
    }

    public void setRegNum(String regNum) {
        this.regNum = regNum;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public Person.State getState() {
        return state;
    }

    public void setState(Person.State state) {
        this.state = state;
    }
}
