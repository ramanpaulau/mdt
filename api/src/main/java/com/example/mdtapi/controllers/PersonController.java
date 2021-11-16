package com.example.mdtapi.controllers;

import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.PersonMessage;
import com.example.mdtapi.models.PersonView;
import com.example.mdtapi.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class PersonController {

    @Autowired
    private PersonRepository personRepository;

    @MessageMapping("/persons")
    @SendTo("/ws/persons")
    public Person insert(PersonMessage person) throws Exception {
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
}
