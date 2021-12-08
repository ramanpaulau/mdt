package com.example.mdtapi.models;

import java.util.Set;

public class BOLORecords<T> {
    private Integer id;

    private Set<T> record;

    public BOLORecords(Integer id, Set<T> record) {
        this.id = id;
        this.record = record;
    }

    public Integer getIncident() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Set<T> getRecord() {
        return record;
    }

    public void setRecord(Set<T> record) {
        this.record = record;
    }
}
