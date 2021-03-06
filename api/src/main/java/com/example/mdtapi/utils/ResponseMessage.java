package com.example.mdtapi.utils;

public class ResponseMessage {
    private boolean success;
    private String message;

    public ResponseMessage() {
        this.success = true;
        this.message = "";
    }

    public ResponseMessage(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static ResponseMessage NotImplemented() {
        return new ResponseMessage(false, "Not implemented");
    }

    public static ResponseMessage OKMessage() {
        return new ResponseMessage();
    }

    public boolean getSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
