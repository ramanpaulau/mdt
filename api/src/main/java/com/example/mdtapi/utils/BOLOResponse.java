package com.example.mdtapi.utils;

public class BOLOResponse<T> {
    private T body;
    private String action;

    public T getBody() {
        return body;
    }

    public void setBody(T body) {
        this.body = body;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
