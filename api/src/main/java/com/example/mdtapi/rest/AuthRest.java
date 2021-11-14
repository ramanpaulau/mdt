package com.example.mdtapi.rest;

import com.example.mdtapi.models.Person;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:${mdt.cors-port}")
@RestController
public class AuthRest {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthRest(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginData ld) {
        Person person = personRepository.findByRegNum(ld.getRegNum());

        if (person == null)
            return "";

        boolean res = passwordEncoder.matches(ld.getPassword(), person.getPassword());

        return (res)?jwtUtils.generateToken(person):"";
    }

    @PostMapping("/check_token")
    @ResponseBody
    public ValidationResponse verify(@RequestBody ValidationRequest request) {
        String regNum = jwtUtils.validateToken(request.getToken());

        if (regNum == null)
            return null;

        if (regNum.isEmpty())
            return new ValidationResponse(null, false, true);

        Person person = personRepository.findByRegNum(regNum);
        return new ValidationResponse(person.getRegNum(), person.isAdmin(), false);
    }

    @PostMapping("/refresh_token")
    public String refresh(@RequestBody String regNum) {
        Person person = personRepository.findByRegNum(regNum);

        if (person == null)
            return "";

        return jwtUtils.generateToken(person);
    }
}
