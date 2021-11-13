package com.example.mdtapi.rest;

public class LoginData {
    private Integer Tag;
    private String Password;

    public Integer getTag() {
        return Tag;
    }

    public void setTag(Integer tag) {
        Tag = tag;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    @Override
    public String toString() {
        return "LoginData{" +
                "tag=" + Tag +
                ", password='" + Password + '\'' +
                '}';
    }
}
