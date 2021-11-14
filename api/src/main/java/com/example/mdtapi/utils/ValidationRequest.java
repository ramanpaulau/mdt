package com.example.mdtapi.utils;

public class ValidationRequest {
    private String regNum;
    private String token;

    public ValidationRequest(String regNum, String token) {
        this.regNum = regNum;
        this.token = token;
    }

    public String getRegNum() {
        return regNum;
    }

    public void setRegNum(String regNum) {
        this.regNum = regNum;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
