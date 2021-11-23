package com.example.mdtapi.utils;

import java.util.List;

public class Subchapter {
    private int number;
    private String title;
    private List<Law> laws;

    public Subchapter() {
    }

    public Subchapter(int number, String title, List<Law> laws) {
        this.number = number;
        this.title = title;
        this.laws = laws;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Law> getLaws() {
        return laws;
    }

    public void setLaws(List<Law> laws) {
        this.laws = laws;
    }
}
