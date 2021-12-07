package com.example.mdtapi.rest;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.License;
import com.example.mdtapi.models.PasswordToken;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.PasswordTokenRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.utils.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class AuthRest {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private final PasswordTokenRepository passwordTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    public AuthRest(PersonRepository personRepository, PasswordTokenRepository passwordTokenRepository, EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.personRepository = personRepository;
        this.passwordTokenRepository = passwordTokenRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
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

    @PostMapping("/get_password_token")
    public ResponseMessage passwordToken(@RequestBody String request) {
        ResponseMessage res = new ResponseMessage();

        String customer, target;
        JSONObject subchapter = new JSONObject(request);
        try {
            customer = subchapter.getString("customer");
            target = subchapter.getString("target");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }
        Person checkPerson = personRepository.findByRegNum(customer);
        if (!checkPerson.isAdmin()) {
            res.setSuccess(false);
            res.setMessage("Not admin");
            return res;
        }

        Person person = personRepository.findByRegNum(target);

        if (person == null) {
            res.setSuccess(false);
            res.setMessage("Person not found");
            return res;
        }

        PasswordToken token = passwordTokenRepository.findByPerson(person);
        if (token != null) {
            res.setMessage(token.getToken());
            return res;
        }

        String uuid = UUID.randomUUID().toString();
        PasswordToken pToken = new PasswordToken(uuid, person);
        passwordTokenRepository.save(pToken);
        res.setMessage(uuid);
        return res;
    }

    @PostMapping("/set_password")
    public boolean setPassword(@RequestBody PasswordRequest request) {
        Person person = personRepository.findByRegNum(request.getRegNum());
        if (person == null)
            return false;

        PasswordToken token = passwordTokenRepository.findByPerson(person);
        if (token == null)
            return false;

        if (token.isExpired()) {
            passwordTokenRepository.delete(token);
            return false;
        }

        if (token.getToken().compareTo(request.getToken()) != 0)
            return false;

        passwordTokenRepository.delete(token);
        person.setPassword(passwordEncoder.encode(request.getPassword()));
        personRepository.save(person);
        return true;
    }

    @GetMapping("/get_employee_info/{regNum}")
    public Employee employeeInfo(@PathVariable String regNum) {
        Person person = personRepository.findByRegNum(regNum);
        if (person == null)
            return null;

        return employeeRepository.findByPerson(person);
    }
}
