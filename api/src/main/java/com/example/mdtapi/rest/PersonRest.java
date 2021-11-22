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

    @GetMapping("/is_regNum_available/{regNum}")
    public boolean isRegNumAvailable(@PathVariable String regNum) {
        return !personRepository.existsByRegNum(regNum);
    }
}
