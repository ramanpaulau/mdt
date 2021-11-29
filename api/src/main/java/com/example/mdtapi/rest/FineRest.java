package com.example.mdtapi.rest;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.Fine;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.FineRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class FineRest {
    @Autowired
    private final FineRepository fineRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private final PersonRepository personRepository;

    public FineRest(FineRepository fineRepository, EmployeeRepository employeeRepository, PersonRepository personRepository) {
        this.fineRepository = fineRepository;
        this.employeeRepository = employeeRepository;
        this.personRepository = personRepository;
    }

    @GetMapping("/fines")
    public List<Fine> all() {
        return fineRepository.findAll();
    }

    @PostMapping("/fine")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        int amount, employeeId;
        String laws, personRegNum;
        JSONObject subchapter = new JSONObject(request);
        try {
            amount = subchapter.getInt("amount");
            employeeId = subchapter.getInt("employee");
            if (amount < 0 || employeeId < 0)
                throw new JSONException("Negative value");
            personRegNum = subchapter.getString("citizen");
            laws = subchapter.getString("laws");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("Employee not found");
            return res;
        }

        Person person = personRepository.findByRegNum(personRegNum);
        if (person == null) {
            res.setSuccess(false);
            res.setMessage("Person not found");
            return res;
        }

        Fine fine = new Fine();
        fine.setAmount(amount);
        fine.setLaws(laws);
        fine.setEmployee(employee.get());
        fine.setPerson(person);
        fineRepository.save(fine);

        return res;
    }

    @PostMapping("/fine/{id}/state/{state}")
    public ResponseMessage setState(@PathVariable Integer id, @PathVariable Boolean state) {
        ResponseMessage res = ResponseMessage.OKMessage();
        Optional<Fine> fine = fineRepository.findById(id);
        if (fine.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("Fine not found");
            return res;
        }

        fine.get().setState(state);
        fineRepository.save(fine.get());
        return res;
    }
}
