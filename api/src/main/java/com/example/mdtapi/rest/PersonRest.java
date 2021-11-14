package com.example.mdtapi.rest;

import com.example.mdtapi.models.Person;
import com.example.mdtapi.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@CrossOrigin(origins = "http://localhost:${mdt.cors-port}")
@RestController
public class PersonRest {


    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public PersonRest(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @GetMapping("/persons")
    public List<Person> all() {
        return personRepository.findAll();
    }

    @PostConstruct
    public void init() {
        if (personRepository.findByRegNum("0000") != null)
            return;

        Person admin = new Person();
        admin.setRegNum("0000");
        admin.setName("Admin");
        admin.setSurname("Admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setBirthdate(LocalDate.of( 1970 , Month.JANUARY, 1 ));
        admin.setPhoneNumber("145-1234");
        admin.setAdmin(true);
        admin.setState(Person.State.ALIVE);

        System.out.println(admin);

        personRepository.save(admin);
    }
}
