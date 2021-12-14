package com.example.mdtapi.rest;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.License;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.Qualification;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.repositories.QualificationRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class QualificationRest {

    @Autowired
    private final QualificationRepository qualificationRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    public QualificationRest(QualificationRepository qualificationRepository, EmployeeRepository employeeRepository) {
        this.qualificationRepository = qualificationRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/qualifications")
    public List<Qualification> all() {
        return qualificationRepository.findAll();
    }

    @PostMapping("/qualification")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        String name, description;
        JSONObject subchapter = new JSONObject(request);
        try {
            name = subchapter.getString("name");
            description = subchapter.getString("description");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        if (qualificationRepository.existsByName(name)) {
            res.setSuccess(false);
            res.setMessage("Name occupied");
            return res;
        }

        Qualification qualification = new Qualification(name, description);
        qualificationRepository.save(qualification);
        return res;
    }

    @DeleteMapping ("/qualification/{id}")
    public ResponseMessage remove(@PathVariable Integer id) {
        ResponseMessage res = ResponseMessage.OKMessage();

        Optional<Qualification> qualification = qualificationRepository.findById(id);
        if (qualification.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("Qualification not found.");
            return res;
        }

        List<Employee> employees = employeeRepository.findAll();
        for (Employee e : employees) {
            if (e.getQualifications().contains(qualification.get())) {
                res.setSuccess(false);
                res.setMessage("All qualifications must be removed.");
                return res;
            }
        }

        qualificationRepository.delete(qualification.get());
        return res;
    }
}
