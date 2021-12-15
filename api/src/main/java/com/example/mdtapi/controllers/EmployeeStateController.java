package com.example.mdtapi.controllers;

import com.example.mdtapi.models.*;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.EmployeeStateRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.repositories.WorkHoursRepository;
import com.example.mdtapi.utils.EmployeeStateResponse;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Controller
public class EmployeeStateController {
    @Autowired
    private final EmployeeStateRepository employeeStateRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private final WorkHoursRepository workHoursRepository;

    public EmployeeStateController(EmployeeStateRepository employeeStateRepository, EmployeeRepository employeeRepository, WorkHoursRepository workHoursRepository) {
        this.employeeStateRepository = employeeStateRepository;
        this.employeeRepository = employeeRepository;
        this.workHoursRepository = workHoursRepository;
    }

    @MessageMapping("/employees/state")
    @SendTo("/ws/active/employees")
    public EmployeeStateResponse setState(@RequestBody String request) {

        int employeeId = 0;
        String state = "";
        JSONObject subchapter = new JSONObject(request);
        try {
            employeeId = subchapter.getInt("id");
            if (employeeId < 0)
                throw new JSONException("Negative value");
            state = subchapter.getString("state");
        } catch (JSONException ignored) {}

        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isEmpty())  {
            return null;
        }

        EmployeeState employeeState = employeeStateRepository.findByEmployee(employee.get());
        if (employeeState == null) {
            employeeState = new EmployeeState();
            employeeState.setEmployee(employee.get());
        } else if (state.compareTo("10-8") == 0) {
            return null;
        }
        employeeState.setState(state);

        if (state.equals("10-7"))
            employeeStateRepository.delete(employeeState);
        else
            employeeStateRepository.save(employeeState);

        WorkHours workHours = workHoursRepository.findByEmployeeAndEndTimeIsNull(employee.get());
        EmployeeStateResponse employeeStateResponse = new EmployeeStateResponse();
        employeeStateResponse.setAction("change");
        if (state.equals("10-7")) {
            employeeStateResponse.setAction("delete");
            if (workHours != null)
                workHours.setEndTime(LocalDateTime.now());
        } else if (state.equals("10-8")) {
            employeeStateResponse.setAction("add");
            if (workHours == null) {
                workHours = new WorkHours();
                workHours.setEmployee(employee.get());
                workHours.setStartTime(LocalDateTime.now());
                workHours.setSalary(employee.get().getSalary());
            }
        }

        if (workHours != null)
            workHoursRepository.save(workHours);
        employeeStateResponse.setEmployee(employee.get());
        employeeStateResponse.setState(state);

        return employeeStateResponse;
    }

    @MessageMapping("/employee/unit/set")
    @SendTo("/ws/active/employees")
    public EmployeeStateResponse addUnit(@RequestBody String request) {
        int employeeId = 0;
        String unit = "";
        JSONObject subchapter = new JSONObject(request);
        try {
            employeeId = subchapter.getInt("id");
            if (employeeId < 0)
                throw new JSONException("Negative value");
            unit = subchapter.getString("unit");
        } catch (JSONException ignored) {}

        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isEmpty())  {
            return null;
        }

        EmployeeState employeeState = employeeStateRepository.findByEmployee(employee.get());
        if (employeeState == null)
            return null;

        employeeState.setUnit(unit);
        employeeStateRepository.save(employeeState);
        EmployeeStateResponse employeeStateResponse = new EmployeeStateResponse();
        employeeStateResponse.setAction("change");
        employeeStateResponse.setEmployee(employeeState.getEmployee());
        employeeStateResponse.setState(employeeState.getState());
        employeeStateResponse.setUnit(unit);
        return employeeStateResponse;
    }

}
