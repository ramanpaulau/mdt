package com.example.mdtapi.rest;

import com.example.mdtapi.models.*;
import com.example.mdtapi.repositories.*;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
public class IndictmentRest {

    @Autowired
    private final IndictmentRepository indictmentRepository;

    @Autowired
    private final IncidentRepository incidentRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    public IndictmentRest(IndictmentRepository indictmentRepository, IncidentRepository incidentRepository, EmployeeRepository employeeRepository, PersonRepository personRepository, DepartmentRepository departmentRepository) {
        this.indictmentRepository = indictmentRepository;
        this.incidentRepository = incidentRepository;
        this.employeeRepository = employeeRepository;
        this.personRepository = personRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/indictments")
    public List<Indictment> all() {
        return indictmentRepository.findAll();
    }

    @GetMapping("/indictments/person/{regNum}")
    public List<Indictment> byPerson(@PathVariable String regNum) {
        Person person = personRepository.findByRegNum(regNum);
        if (person == null)
            return null;

        return indictmentRepository.findByPerson(person);
    }

    @PostMapping("/indictment")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        System.out.println(request);

        int incidentId, departmentCode, employeeId;
        String personRegNum, startTime, endTime, laws;
        JSONObject subchapter = new JSONObject(request);
        try {
            incidentId = subchapter.getInt("incident");
            departmentCode = subchapter.getInt("department");
            employeeId = subchapter.getInt("employee");
            if (incidentId < 0 || departmentCode < 0 || employeeId < 0)
                throw new JSONException("Negative value");
            personRegNum = subchapter.getString("citizen");
            startTime = subchapter.getString("startTime");
            endTime = subchapter.getString("endTime");
            laws = subchapter.getString("laws");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Department department = departmentRepository.findByCode(departmentCode);
        if (department == null) {
            res.setSuccess(false);
            res.setMessage("Department not found");
            return res;
        }

        Person person = personRepository.findByRegNum(personRegNum);
        if (person == null) {
            res.setSuccess(false);
            res.setMessage("Person not found");
            return res;
        }

        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("Employee not found");
            return res;
        }

        Optional<Incident> incident = incidentRepository.findById(incidentId);
        if (incident.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("Incident not found");
            return res;
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy, HH:mm:ss");

        Indictment indictment = new Indictment();
        indictment.setDepartment(department);
        indictment.setPerson(person);
        indictment.setStartTime(LocalDateTime.parse(startTime, formatter));
        indictment.setEndTime(LocalDateTime.parse(endTime, formatter));
        indictment.setEmployee(employee.get());
        indictment.setLaws(laws);

        indictmentRepository.save(indictment);
        incident.get().getIndictments().add(indictment);
        incidentRepository.save(incident.get());
        return res;
    }
}
