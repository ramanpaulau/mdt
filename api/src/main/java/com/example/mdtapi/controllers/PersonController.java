package com.example.mdtapi.controllers;

import com.example.mdtapi.models.License;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.PersonMessage;
import com.example.mdtapi.models.PersonView;
import com.example.mdtapi.repositories.LicenseRepository;
import com.example.mdtapi.repositories.PersonRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Controller
public class PersonController {

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private final LicenseRepository licenseRepository;

    public PersonController(PersonRepository personRepository, LicenseRepository licenseRepository) {
        this.personRepository = personRepository;
        this.licenseRepository = licenseRepository;
    }

    @MessageMapping("/persons")
    @SendTo("/ws/persons")
    public Person insert(PersonMessage person) {
        Person newPerson = new Person();
        newPerson.setName(person.getName());
        newPerson.setSurname(person.getSurname());
        newPerson.setRegNum(person.getRegNum());
        newPerson.setPhoneNumber(person.getPhoneNumber());
        newPerson.setBirthdate(person.getBirthdate());
        newPerson.setState(person.getState());
        personRepository.save(newPerson);
        return newPerson;
    }

    @MessageMapping("/person/license/add")
    @SendTo("/ws/persons")
    public Person addLicense(@RequestBody String request) {
        int lid = -1;
        String regNum = "";
        JSONObject subchapter = new JSONObject(request);
        try {
            regNum = subchapter.getString("regNum");
            lid = subchapter.getInt("lid");
            if (lid < 0)
                throw new JSONException("Negative value");
        } catch (JSONException ignored) {}

        Person person = personRepository.findByRegNum(regNum);
        Optional<License> license = licenseRepository.findById(lid);
        if (person == null || license.isEmpty())
            return null;

        person.getLicenses().add(license.get());

        personRepository.save(person);
        return person;
    }

    @MessageMapping("/person/license/delete")
    @SendTo("/ws/persons")
    public Person deleteLicense(@RequestBody String request) {
        int lid = -1;
        String regNum = "";
        JSONObject subchapter = new JSONObject(request);
        try {
            regNum = subchapter.getString("regNum");
            lid = subchapter.getInt("lid");
            if (lid < 0)
                throw new JSONException("Negative value");
        } catch (JSONException ignored) {}

        Person person = personRepository.findByRegNum(regNum);
        Optional<License> license = licenseRepository.findById(lid);

        if (person == null || license.isEmpty())
            return null;

        person.removeLicense(license.get());
        personRepository.save(person);
        return person;
    }
}
