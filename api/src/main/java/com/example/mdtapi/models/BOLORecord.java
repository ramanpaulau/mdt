package com.example.mdtapi.models;

public class BOLORecord<T> {
    private Incident incident;

    private T record;

    public BOLORecord(Incident incident, T record) {
        this.incident = incident;
        this.record = record;
    }

    public Incident getIncident() {
        return incident;
    }

    public void setIncident(Incident incident) {
        this.incident = incident;
    }

    public T getRecord() {
        return record;
    }

    public void setRecord(T record) {
        this.record = record;
    }
}
