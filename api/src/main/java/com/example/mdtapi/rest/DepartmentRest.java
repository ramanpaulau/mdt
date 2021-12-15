package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.Unit;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.repositories.UnitRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

@RestController
public class DepartmentRest {

    @Autowired
    private final DepartmentRepository departmentRepository;

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private final UnitRepository unitRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    public DepartmentRest(DepartmentRepository departmentRepository, PersonRepository personRepository, UnitRepository unitRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.personRepository = personRepository;
        this.unitRepository = unitRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/departments")
    public List<Department> all() {
        return departmentRepository.findAllByOrderByCodeAsc();
    }

    @PostMapping ("/department")
    public void insert(@RequestBody Department department) {
        Department department1 = departmentRepository.findByCode(department.getCode());

        if (department1 != null) {
            department1.setDescription(department.getDescription());
            department1.setTitle(department.getTitle());
            department1.setShortTitle(department.getShortTitle());
            departmentRepository.save(department1);
            return;
        }
        departmentRepository.save(department);
    }

    @GetMapping("/department/{code}/unit")
    public String getMainUnit(@PathVariable Integer code) {
        Department department = departmentRepository.findByCode(code);
        return (department == null) ? "" : department.getUnit();
    }

    @PostMapping("/department/{code}/main/{abbr}")
    public ResponseMessage setMainUnit(@PathVariable Integer code, @PathVariable String abbr) {
        ResponseMessage res = ResponseMessage.OKMessage();
        Department department = departmentRepository.findByCode(code);
        if (department == null) {
            res.setSuccess(false);
            res.setMessage("Department not found");
            return res;
        }

        Optional<Unit> unit = unitRepository.getByAbbreviation(abbr);
        if (unit.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("Unit not found");
            return res;
        }

        department.setUnit(unit.get());
        departmentRepository.save(department);
        return res;
    }

    @PostMapping("/department/{code}/leader/{eid}")
    public void setLeader(@PathVariable int code, @PathVariable int eid) {
        Department department = departmentRepository.findByCode(code);
        Optional<Employee> employee = employeeRepository.findById(eid);
        if (department == null || employee.isEmpty())
            return;

        department.setLeader(employee.get());
        departmentRepository.save(department);
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
        departmentRepository.save(dep);
    }
}
