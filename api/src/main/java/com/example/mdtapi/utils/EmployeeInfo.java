package com.example.mdtapi.utils;

public class EmployeeInfo {
    private Integer employeeId;
    private String employeeMarking;
    private Integer departmentCode;
    private Boolean departmentLeader;

    public EmployeeInfo(Integer employeeId, String employeeMarking, Integer departmentCode, Boolean departmentLeader) {
        this.employeeId = employeeId;
        this.employeeMarking = employeeMarking;
        this.departmentCode = departmentCode;
        this.departmentLeader = departmentLeader;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeMarking() {
        return employeeMarking;
    }

    public void setEmployeeMarking(String employeeMarking) {
        this.employeeMarking = employeeMarking;
    }

    public Integer getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(Integer departmentCode) {
        this.departmentCode = departmentCode;
    }

    public Boolean getDepartmentLeader() {
        return departmentLeader;
    }

    public void setDepartmentLeader(Boolean departmentLeader) {
        this.departmentLeader = departmentLeader;
    }
}
