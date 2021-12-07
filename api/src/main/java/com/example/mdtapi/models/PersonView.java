package com.example.mdtapi.models;

import java.time.LocalDate;
import java.util.Set;

public interface PersonView {
    String getRegNum();

    String getName();

    String getSurname();

    LocalDate getBirthdate();

    String getPhoneNumber();

    Set<License> getLicenses();

    Person.State getState();
}
