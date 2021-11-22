package com.example.mdtapi.utils;

import com.example.mdtapi.models.Department;


public class InsertRankBody {
    private String title;
    private Short salary;
    private Integer departmentCode;

    public InsertRankBody() {
    }

    public InsertRankBody(String title, Short salary, Integer departmentCode) {
        this.title = title;
        this.salary = salary;
        this.departmentCode = departmentCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Short getSalary() {
        return salary;
    }

    public void setSalary(Short salary) {
        this.salary = salary;
    }

    public Integer getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(Integer departmentCode) {
        this.departmentCode = departmentCode;
    }

    @Override
    public String toString() {
        return "InsertRankBody{" +
                "title='" + title + '\'' +
                ", salary=" + salary +
                ", departmentCode=" + departmentCode +
                '}';
    }
}
