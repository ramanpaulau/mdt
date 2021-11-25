package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.Rank;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.repositories.RankRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    public EmployeeRest(EmployeeRepository employeeRepository, PersonRepository personRepository, DepartmentRepository departmentRepository, RankRepository rankRepository) {
        this.employeeRepository = employeeRepository;
        this.personRepository = personRepository;
        this.departmentRepository = departmentRepository;
        this.rankRepository = rankRepository;
    }

    @GetMapping("/employees")
    private List<Employee> all() {
        return employeeRepository.findAllByOrderByTagAsc();
    }

    @PostMapping("/employee")
    private ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = new ResponseMessage();
        
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
}
