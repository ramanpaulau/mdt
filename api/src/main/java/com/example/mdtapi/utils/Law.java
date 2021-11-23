package com.example.mdtapi.utils;

public class Law {
    private int number;
    private String text;
    private int fine;
    private int detention;

    public Law() {
    }

    public Law(int number, String text, int fine, int detention) {
        this.number = number;
        this.text = text;
        this.fine = fine;
        this.detention = detention;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getFine() {
        return fine;
    }

    public void setFine(int fine) {
        this.fine = fine;
    }

    public int getDetention() {
        return detention;
    }

    public void setDetention(int detention) {
        this.detention = detention;
    }
}
