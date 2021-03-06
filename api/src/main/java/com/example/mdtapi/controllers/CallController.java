package com.example.mdtapi.controllers;

import com.example.mdtapi.models.*;
import com.example.mdtapi.repositories.*;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Optional;

@Controller
public class CallController {

    @Autowired
    private final CallRepository callRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private final IncidentRepository incidentRepository;

    @Autowired
    private final PersonRepository personRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    @Autowired
    private final IndictmentRepository indictmentRepository;

    public CallController(CallRepository callRepository, EmployeeRepository employeeRepository, IncidentRepository incidentRepository, PersonRepository personRepository, DepartmentRepository departmentRepository, IndictmentRepository indictmentRepository) {
        this.callRepository = callRepository;
        this.employeeRepository = employeeRepository;
        this.incidentRepository = incidentRepository;
        this.personRepository = personRepository;
        this.departmentRepository = departmentRepository;
        this.indictmentRepository = indictmentRepository;
    }

    @MessageMapping("/calls")
    @SendTo("/ws/calls")
    private Call registerCall(@RequestBody String request) {
        String phone = "", text = "", location = "";
        JSONObject subchapter = new JSONObject(request);
        try {
            phone = subchapter.getString("phone");
            text = subchapter.getString("text");
            location = subchapter.getString("location");
        } catch (JSONException ignored) {}

        Call call = new Call();
        call.setLocation(location);
        call.setPhone(phone);
        call.setText(text);

        callRepository.save(call);
        return call;
    }

    @MessageMapping("/calls/panic")
    @SendTo("/ws/calls")
    private Call registerPanic(@RequestBody String request) {
        String text = "", location = "";
        int eid = 0;
        JSONObject subchapter = new JSONObject(request);
        try {
            eid = subchapter.getInt("eid");
        } catch (JSONException ignored) {}

        Optional<Employee> employee = employeeRepository.findById(eid);
        if (employee.isEmpty()) {
            return null;
        }

        Call call = new Call();
        call.setLocation("Panic " + employee.get().getMarking());
        call.setPhone("Panic-Button");
        call.setText("[System]");

        callRepository.save(call);
        return call;
    }

    @MessageMapping("/call/officers")
    @SendTo("/ws/calls")
    private Call addOfficer(@RequestBody String request) {
        int employeeId = -1, callId = -1;
        JSONObject subchapter = new JSONObject(request);
        try {
            callId = subchapter.getInt("callId");
            employeeId = subchapter.getInt("employeeId");
            if (employeeId < 0 || callId < 0)
                throw new JSONException("Negative value");
        } catch (JSONException ignored) {}

        Optional<Call> call = callRepository.findById(callId);
        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (call.isEmpty() || employee.isEmpty())
            return null;

        call.get().getEmployees().add(employee.get());
        callRepository.save(call.get());
        call = callRepository.findById(callId);
        return call.get();
    }

    @MessageMapping("/call/incident/add")
    @SendTo("/ws/calls")
    private Call setIncident(@RequestBody String request) {
        int cid = -1, iid = -1;
        JSONObject subchapter = new JSONObject(request);
        try {
            cid = subchapter.getInt("cid");
            iid = subchapter.getInt("iid");
            if (cid < 0 || iid < 0)
                throw new JSONException("Negative value");
        } catch (JSONException ignored) {}

        Optional<Incident> incident = incidentRepository.findById(iid);
        Optional<Call> call = callRepository.findById(cid);

        if (call.isEmpty() || incident.isEmpty())
            return null;

        call.get().setIncident(incident.get());
        callRepository.save(call.get());
        return call.get();
    }

    @MessageMapping("/call/incident/delete")
    @SendTo("/ws/calls")
    private Call deleteIncident(@RequestBody String request) {
        int cid = -1;
        JSONObject subchapter = new JSONObject(request);
        try {
            cid = subchapter.getInt("cid");
            if (cid < 0)
                throw new JSONException("Negative value");
        } catch (JSONException ignored) {}
        Optional<Call> call = callRepository.findById(cid);

        if (call.isEmpty())
            return null;

        call.get().setIncident(null);
        callRepository.save(call.get());
        return call.get();
    }

    @MessageMapping("/call/indictment/add")
    @SendTo("/ws/calls")
    public Call addIndictment(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

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
            return null;
        }

        Department department = departmentRepository.findByCode(departmentCode);
        Person person = personRepository.findByRegNum(personRegNum);
        Optional<Employee> employee = employeeRepository.findById(employeeId);
        Optional<Incident> incident = incidentRepository.findById(incidentId);
        if (department == null || person == null || employee.isEmpty() || incident.isEmpty())
            return null;

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

        Call call = new Call();
        call.setLocation("Detention end: " + department.getShortTitle());
        call.setPhone(personRegNum);
        call.setText("[System]");
        call.setTime(indictment.getEndTime());

        callRepository.save(call);
        return call;
    }
}
