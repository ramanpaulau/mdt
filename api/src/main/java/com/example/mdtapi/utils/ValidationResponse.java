package com.example.mdtapi.utils;

public class ValidationResponse {
    private String regNum;
    private boolean admin = false;
    private boolean expired = false;

    public ValidationResponse(String regNum, boolean admin, boolean expired) {
        this.regNum = regNum;
        this.admin = admin;
        this.expired = expired;
    }

    public String getRegNum() {
        return regNum;
    }

    public void setRegNum(String regNum) {
        this.regNum = regNum;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean isExpired() {
        return expired;
    }

    public void setExpired(boolean expired) {
        this.expired = expired;
    }
}
