package com.example.mdtapi.rest;

import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.PersonView;
import com.example.mdtapi.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@RestController
public class PersonRest {

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    public PersonRest(PersonRepository personRepository, PasswordEncoder passwordEncoder) {
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/persons")
    public List<PersonView> all() {
        return personRepository.findAllProjectedBy();
    }

    @PostConstruct
    public void init() {
        Person person = new Person();
        person.setRegNum("0000");
        person.setName("Admin");
        person.setSurname("Admin");
        person.setPassword(passwordEncoder.encode("admin"));
        person.setBirthdate(LocalDate.of( 1970 , Month.JANUARY, 23 ));
        person.setPhoneNumber("145-1234");
        person.setAdmin(true);
        person.setState(Person.State.ALIVE);
        personRepository.save(person);

        person = new Person();
        person.setRegNum("1LS4");
        person.setName("Hugo");
        person.setSurname("Bassett");
        person.setPassword(passwordEncoder.encode("hugo"));
        person.setBirthdate(LocalDate.of( 1988 , Month.AUGUST, 17 ));
        person.setPhoneNumber("054-1775");
        person.setAdmin(false);
        person.setState(Person.State.ALIVE);
        personRepository.save(person);

        person.setRegNum("28HJ");
        person.setName("Skye");
        person.setSurname("Hahn");
        person.setPassword(passwordEncoder.encode("skye"));
        person.setBirthdate(LocalDate.of( 1973 , Month.MAY, 9 ));
        person.setPhoneNumber("979-2521");
        person.setAdmin(false);
        person.setState(Person.State.ALIVE);
        personRepository.save(person);
    }

    @GetMapping("/is_regNum_available/{regNum}")
    public boolean isRegNumAvailable(@PathVariable String regNum) {
        return !personRepository.existsByRegNum(regNum);
    }
}
