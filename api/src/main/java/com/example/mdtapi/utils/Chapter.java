package com.example.mdtapi.utils;

import java.util.List;

public class Chapter {
    private int number;
    private String title;
    private List<Subchapter> subchapters;

    public Chapter() {
    }

    public Chapter(int number, String title, List<Subchapter> subchapters) {
        this.number = number;
        this.title = title;
        this.subchapters = subchapters;
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

    public List<Subchapter> getSubchapters() {
        return subchapters;
    }

    public void setSubchapters(List<Subchapter> subchapters) {
        this.subchapters = subchapters;
    }
}
