package com.example.mdtapi.rest;

public class JWT {
    private String Name;
    private Boolean Value;

    public JWT(String name, Boolean value) {
        Name = name;
        Value = value;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public Boolean getValue() {
        return Value;
    }

    public void setValue(Boolean value) {
        Value = value;
    }
}
