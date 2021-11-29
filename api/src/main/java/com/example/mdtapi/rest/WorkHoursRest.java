package com.example.mdtapi.rest;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.WorkHours;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.EmployeeStateRepository;
import com.example.mdtapi.repositories.WorkHoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class WorkHoursRest {

    @Autowired
    private final WorkHoursRepository workHoursRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    public WorkHoursRest(WorkHoursRepository workHoursRepository, EmployeeRepository employeeRepository) {
        this.workHoursRepository = workHoursRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/work-hours/{id}")
    public List<WorkHours> all(@PathVariable Integer id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isEmpty()) {
            return null;
        }

        return workHoursRepository.findByEmployeeAndEndTimeIsNotNull(employee.get());
    }
}
