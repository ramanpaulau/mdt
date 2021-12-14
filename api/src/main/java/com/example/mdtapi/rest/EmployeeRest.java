package com.example.mdtapi.rest;

import com.example.mdtapi.models.*;
import com.example.mdtapi.repositories.*;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.management.Query;
import javax.xml.transform.Result;
import java.util.List;
import java.util.Optional;

@RestController
public class EmployeeRest {

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    @Autowired
    private final RankRepository rankRepository;

    @Autowired
    private final QualificationRepository qualificationRepository;

    @Autowired
    private final UnitRepository unitRepository;

    public EmployeeRest(EmployeeRepository employeeRepository, PersonRepository personRepository, DepartmentRepository departmentRepository, RankRepository rankRepository, QualificationRepository qualificationRepository, UnitRepository unitRepository) {
        this.employeeRepository = employeeRepository;
        this.personRepository = personRepository;
        this.departmentRepository = departmentRepository;
        this.rankRepository = rankRepository;
        this.qualificationRepository = qualificationRepository;
        this.unitRepository = unitRepository;
    }

    @GetMapping("/employees")
    private List<Employee> all() {
        return employeeRepository.findAllByOrderByTagAsc();
    }

    @PostMapping("/employee")
    private ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();
        
        int tag, departmentCode;
        String regNum, rankTitle;
        JSONObject subchapter = new JSONObject(request);
        try {
            tag = subchapter.getInt("tag");
            departmentCode = subchapter.getInt("department");
            if (tag < 0)
                throw new JSONException("Negative value");
            regNum = subchapter.getString("regNum");
            rankTitle = subchapter.getString("rank");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        if (employeeRepository.existsByTagAndDepartmentCode(tag, departmentCode)) {
            res.setSuccess(false);
            res.setMessage("Employee exists");
            return res;
        }

        Employee employee = new Employee();
        employee.setTag(tag);

        Person person = personRepository.findByRegNum(regNum);
        if (person == null) {
            res.setSuccess(false);
            res.setMessage("Person not found");
            return res;
        } else if (employeeRepository.findByPerson(person) != null) {
            res.setSuccess(false);
            res.setMessage("Employee exists");
            return res;
        }
        employee.setPerson(person);


        Department department = departmentRepository.findByCode(departmentCode);
        if (department == null) {
            res.setSuccess(false);
            res.setMessage("Department not found");
            return res;
        }
        employee.setDepartment(department);

        Rank rank = rankRepository.findByTitle(rankTitle);
        if (rank == null) {
            res.setSuccess(false);
            res.setMessage("Rank not found");
            return res;
        }
        employee.setRank(rank);

        employeeRepository.save(employee);
        return res;
    }

    @GetMapping("/employee/exists/{department}/{tag}")
    private boolean existsByTag(@PathVariable Integer department, @PathVariable Integer tag) {
        if (tag == null)
            return false;

        return employeeRepository.existsByTagAndDepartmentCode(tag, department);
    }

    @PostMapping("/employee/{eid}/qualification/{qid}/add")
    public void addQualification(@PathVariable int eid, @PathVariable int qid) {
        Optional<Employee> employee = employeeRepository.findById(eid);
        Optional<Qualification> qualification = qualificationRepository.findById(qid);

        if (employee.isEmpty() || qualification.isEmpty())
            return;

        employee.get().getQualifications().add(qualification.get());
        employeeRepository.save(employee.get());
    }

    @DeleteMapping("/employee/{eid}/qualification/{qid}/delete")
    public void removeQualification(@PathVariable int eid, @PathVariable int qid) {
        Optional<Employee> employee = employeeRepository.findById(eid);
        Optional<Qualification> qualification = qualificationRepository.findById(qid);

        if (employee.isEmpty() || qualification.isEmpty())
            return;

        employee.get().getQualifications().remove(qualification.get());
        employeeRepository.save(employee.get());
    }

    @PostMapping("/employee/{eid}/unit/{abbr}/set")
    public void addUnit(@PathVariable int eid, @PathVariable String abbr) {
        Optional<Employee> employee = employeeRepository.findById(eid);
        Optional<Unit> unit = unitRepository.getByAbbreviation(abbr);

        if (employee.isEmpty() || unit.isEmpty())
            return;

        employee.get().setUnit(unit.get());
        employeeRepository.save(employee.get());
    }

    @DeleteMapping("/employee/{eid}/unit")
    public void removeUnit(@PathVariable int eid) {
        Optional<Employee> employee = employeeRepository.findById(eid);

        if (employee.isEmpty())
            return;

        employee.get().setUnit(null);
        employeeRepository.save(employee.get());
    }
}
