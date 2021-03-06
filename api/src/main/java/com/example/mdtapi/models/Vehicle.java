package com.example.mdtapi.models;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Vehicle {
    private @Id Integer vin;
    private String plateNum;
    private String name;
    private Integer price;

    @ManyToOne(targetEntity = Department.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "department_code")
    private Department department;

    public Vehicle() {
    }

    public Vehicle(Integer vin, String plateNum, String name, Integer price, Department department) {
        this.vin = vin;
        this.plateNum = plateNum;
        this.name = name;
        this.price = price;
        this.department = department;
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

    public Integer getDepartment() {
        return (department != null)?department.getCode():0;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vehicle vehicle = (Vehicle) o;
        return Objects.equals(vin, vehicle.vin) && Objects.equals(plateNum, vehicle.plateNum) && Objects.equals(name, vehicle.name) && Objects.equals(price, vehicle.price) && Objects.equals(department, vehicle.department);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vin, plateNum, name, price, department);
    }
}
