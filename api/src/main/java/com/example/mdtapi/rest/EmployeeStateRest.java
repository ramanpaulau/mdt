package com.example.mdtapi.rest;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.EmployeeState;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.EmployeeStateRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class EmployeeStateRest {

    @Autowired
    private final EmployeeStateRepository employeeStateRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    public EmployeeStateRest(EmployeeStateRepository employeeStateRepository, EmployeeRepository employeeRepository) {
        this.employeeStateRepository = employeeStateRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/employee/states")
    public List<EmployeeState> all() {
        return employeeStateRepository.findAll();
    }

    @PostMapping("/employee/{id}/state/{state}")
    public ResponseMessage insert(@PathVariable Integer id, @PathVariable String state) {
        ResponseMessage res = ResponseMessage.OKMessage();

        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isEmpty())  {
            res.setSuccess(false);
            res.setMessage("Employee not found");
            return res;
        }

        EmployeeState employeeState = employeeStateRepository.findByEmployee(employee.get());
        if (employeeState == null) {
            employeeState = new EmployeeState();
            employeeState.setEmployee(employee.get());
        }
        employeeState.setState(state);
        employeeStateRepository.save(employeeState);
        return res;
    }
}