package com.example.mdtapi.models;

import javax.persistence.Id;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import java.util.Date;

@Entity
public class PasswordToken {

    public static final long PASSWORD_TOKEN_VALIDITY = 24 * 60 * 60;

    private @Id String token;

    @OneToOne(targetEntity = Person.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "person_regNum")
    private Person person;

    private Date expiryDate;

    public PasswordToken() {
    }

    public PasswordToken(String token, Person person) {
        this.token = token;
        this.person = person;
    }

    public String getToken() {
        return token;
    }
}
