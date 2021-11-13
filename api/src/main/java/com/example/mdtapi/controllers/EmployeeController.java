package com.example.mdtapi.controllers;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @MessageMapping("/string")
    @SendTo("/api/employee")
    public Employee test(String name) throws Exception {
        return new Employee(name, "adasd", "asdasd", new Date(), 15);
    }
}
