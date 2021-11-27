package com.example.mdtapi.models;

import javax.persistence.*;

@Entity
public class Vehicle {
    private @Id Integer vin;
    private String plateNum;
    private String name;
    private Integer price;

    /*@OneToOne(targetEntity = Person.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "person_regNum")
    private Person owner;*/

    public Vehicle() {
    }

    public Vehicle(Integer vin, String plateNum, String name, Integer price) {
        this.vin = vin;
        this.plateNum = plateNum;
        this.name = name;
        this.price = price;
    }

    public Integer getVin() {
        return vin;
    }

    public void setVin(Integer vin) {
        this.vin = vin;
    }

    public String getPlateNum() {
        return plateNum;
    }

    public void setPlateNum(String plateNum) {
        this.plateNum = plateNum;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    /*public Person getOwner() {
        return owner;
    }

    public void setOwner(Person owner) {
        this.owner = owner;
    }*/
}
