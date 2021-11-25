package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.List;

@RestController
public class DepartmentRest {

    @Autowired
    private final DepartmentRepository departmentRepository;

    @Autowired
    private final PersonRepository personRepository;

    public DepartmentRest(DepartmentRepository departmentRepository, PersonRepository personRepository) {
        this.departmentRepository = departmentRepository;
        this.personRepository = personRepository;
    }

    @GetMapping("/departments")
    public List<Department> all() {
        return departmentRepository.findAllByOrderByCodeAsc();
    }

    @PostMapping ("/department")
    public void insert(@RequestBody Department department) {
        System.out.println(department);
        departmentRepository.save(department);
    }

    @GetMapping("/department/{code}/unit")
    public String getMainUnit(@PathVariable Integer code) {
        Department department = departmentRepository.findByCode(code);
        return (department == null) ? "" : department.getUnit();
    }

    @PostMapping("/department/unit")
    public ResponseMessage getMainUnit(@PathVariable String request) {
        ResponseMessage res = new ResponseMessage(false, "Not Implemented");
        return res;
    }

    @GetMapping("/is_depCode_available/{code}")
    public boolean isDepCodeAvailable(@PathVariable Integer code) {
        return !departmentRepository.existsByCode(code);
    }

    @GetMapping("/is_shortTitle_available/{shortTitle}")
    public boolean isShortTitleAvailable(@PathVariable String shortTitle) {
        return !departmentRepository.existsByShortTitle(shortTitle);
    }

    @PostConstruct
    public void init() {
        Department dep = new Department();
        dep.setCode(1);
        dep.setShortTitle("SAHP");
        dep.setTitle("San Andreas Highway Patrol");
        dep.setDescription("Fast cars.");
        Person leader = new Person();
        leader.setRegNum("1111");
        leader.setSurname("asdasd");
        personRepository.save(leader);
        dep.setLeader(leader);
        departmentRepository.save(dep);
    }
}
