package com.example.mdtapi.controllers;

import com.example.mdtapi.models.Person;
import com.example.mdtapi.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PersonController {

    @Autowired
    private PersonRepository personRepository;

    @MessageMapping("/string")
    @SendTo("/api/employee")
    public Person test(String name) throws Exception {
        return new Person();
    }
}
