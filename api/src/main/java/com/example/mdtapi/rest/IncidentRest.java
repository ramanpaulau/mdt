package com.example.mdtapi.rest;

import com.example.mdtapi.models.*;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.FineRepository;
import com.example.mdtapi.repositories.IncidentRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.criteria.CriteriaBuilder;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class IncidentRest {

    @Autowired
    private final IncidentRepository incidentRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    public IncidentRest(IncidentRepository incidentRepository, EmployeeRepository employeeRepository) {
        this.incidentRepository = incidentRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/incidents")
    public List<Incident> all() {
        return incidentRepository.findAll();
    }

    @GetMapping("/incident/{id}/persons")
    public Set<Person> allPersons(@PathVariable Integer id) {
        Optional<Incident> incident = incidentRepository.findById(id);
        if (incident.isEmpty())
            return null;
        return incident.get().getBoloPersons();
    }

    @GetMapping("/incident/{id}/vehicles")
    public Set<Vehicle> allVehicles(@PathVariable Integer id) {
        Optional<Incident> incident = incidentRepository.findById(id);
        if (incident.isEmpty())
            return null;
        return incident.get().getBoloVehicles();
    }

    @GetMapping("/bolo/persons")
    public Set<BOLORecord<Person>> allBoloPersons() {
        Set<BOLORecord<Person>> res = new HashSet<>();

        List<Incident> incident = incidentRepository.findAll();
        for (Incident i : incident)
            for (Person p : i.getBoloPersons())
                res.add(new BOLORecord<>(i, p));

        return res;
    }

    @GetMapping("/bolo/vehicles")
    public Set<BOLORecord<Vehicle>> allBoloVehicles() {
        Set<BOLORecord<Vehicle>> res = new HashSet<>();

        List<Incident> incident = incidentRepository.findAll();
        for (Incident i : incident)
            for (Vehicle v : i.getBoloVehicles())
                res.add(new BOLORecord<>(i, v));

        return res;
    }

    @PostMapping("/incident")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        String title, details, location, datetime;
        int supervisorId;
        JSONObject subchapter = new JSONObject(request);
        try {
            title = subchapter.getString("title");
            details = subchapter.getString("details");
            location = subchapter.getString("location");
            datetime = subchapter.getString("datetime");
            supervisorId = subchapter.getInt("supervisor");
            if (supervisorId <= 0)
                throw new JSONException("Negative value");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Optional<Employee> supervisor = employeeRepository.findById(supervisorId);
        if (supervisor.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("Employee doesn't exist");
            return res;
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy, HH:mm:ss");

        Incident incident = new Incident();
        incident.setTitle(title);
        incident.setLocation(location);
        incident.setDetails(details);
        incident.setSupervisor(supervisor.get());
        incident.setDateTime(LocalDateTime.parse(datetime, formatter));

        incidentRepository.save(incident);
        return res;
    }
}
