package com.example.mdtapi.models;

import java.time.LocalDate;

public interface PersonView {
    String getRegNum();

    String getName();

    String getSurname();

    LocalDate getBirthdate();

    String getPhoneNumber();

    Person.State getState();
}
