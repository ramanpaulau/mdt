package com.example.mdtapi.rest;

import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.PersonView;
import com.example.mdtapi.models.Vehicle;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.repositories.VehicleRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.Set;

@RestController
public class PersonRest {

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final VehicleRepository vehicleRepository;

    public PersonRest(PersonRepository personRepository, PasswordEncoder passwordEncoder, VehicleRepository vehicleRepository) {
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping("/persons")
    public List<PersonView> all() {
        return personRepository.findAllProjectedBy();
    }

    @PostMapping("/person/vehicle")
    public ResponseMessage addVehicle(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        String regNum, plateNum;
        JSONObject subchapter = new JSONObject(request);
        try {
            regNum = subchapter.getString("regNum");
            plateNum = subchapter.getString("plateNum");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Vehicle vehicle = vehicleRepository.findByPlateNum(plateNum);
        if (vehicle == null) {
            res.setSuccess(false);
            res.setMessage("Vehicle not found");
            return res;
        }

        Person person = personRepository.findByRegNum(regNum);
        if (person == null) {
            res.setSuccess(false);
            res.setMessage("Person not found");
            return res;
        }

        person.getVehicles().add(vehicle);
        /*vehicle.setOwner(person);
        person.getVehicles().add(vehicle);
        vehicleRepository.save(vehicle);*/
        personRepository.save(person);
        return res;
    }

    @GetMapping("/person/{regNum}/vehicles")
    public Set<Vehicle> getVehicles(@PathVariable String regNum) {
        return personRepository.findByRegNum(regNum).getVehicles();
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
