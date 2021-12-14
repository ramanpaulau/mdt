package com.example.mdtapi.rest;

import com.example.mdtapi.models.*;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.FineRepository;
import com.example.mdtapi.repositories.IncidentRepository;
import com.example.mdtapi.repositories.PersonRepository;
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
import java.util.*;

@RestController
public class IncidentRest {

    @Autowired
    private final IncidentRepository incidentRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private final PersonRepository personRepository;

    public IncidentRest(IncidentRepository incidentRepository, EmployeeRepository employeeRepository, PersonRepository personRepository) {
        this.incidentRepository = incidentRepository;
        this.employeeRepository = employeeRepository;
        this.personRepository = personRepository;
    }

    @GetMapping("/incidents")
    public List<Incident> all() {
        return incidentRepository.findAllByOrderByIdDesc();
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

    @GetMapping("/bolo/persons/group")
    public Set<BOLORecords<Person>> allBoloPersonsGroup() {
        Set<BOLORecords<Person>> res = new HashSet<>();

        List<Incident> incidents = incidentRepository.findAll();
        for (Incident i : incidents)
            res.add(new BOLORecords<>(i.getId(), i.getBoloPersons()));

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


    @GetMapping("/bolo/vehicles/group")
    public Set<BOLORecords<Vehicle>> allBoloVehiclesGroup() {
        Set<BOLORecords<Vehicle>> res = new HashSet<>();

        List<Incident> incidents = incidentRepository.findAll();
        for (Incident i : incidents)
            res.add(new BOLORecords<>(i.getId(), i.getBoloVehicles()));

        return res;
    }

    @PostMapping("/incident")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        String title, details, location, datetime;
        int id, supervisorId;
        JSONObject subchapter = new JSONObject(request);
        try {
            title = subchapter.getString("title");
            details = subchapter.getString("details");
            location = subchapter.getString("location");
            datetime = subchapter.getString("datetime");
            id = subchapter.getInt("id");
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

        Optional<Incident> tmp = incidentRepository.findById(id);
        if (id != 0 && tmp.isPresent())
            incident = tmp.get();

        incident.setTitle(title);
        incident.setLocation(location);
        incident.setDetails(details);
        if (id == 0) {
            incident.setSupervisor(supervisor.get());
            incident.setDateTime(LocalDateTime.parse(datetime, formatter));
        }

        incidentRepository.save(incident);
        return res;
    }

    @GetMapping("/incident/{iid}/indictments")
    public Set<Indictment> getIndictments(@PathVariable int iid) {
        Optional<Incident> incident = incidentRepository.findById(iid);

        if (incident.isEmpty())
            return null;

        return incident.get().getIndictments();
    }

    @GetMapping("/incident/officer/{oid}")
    public List<Incident> getIncidents(@PathVariable int oid) {
        Optional<Employee> employee = employeeRepository.findById(oid);

        if (employee.isEmpty())
            return null;

        return incidentRepository.findBySupervisor(employee.get());
    }

    @GetMapping("/incident/{iid}/officers")
    public Set<Employee> getOfficer(@PathVariable int iid) {
        Optional<Incident> incident = incidentRepository.findById(iid);

        if (incident.isEmpty())
            return null;

        return incident.get().getOfficers();
    }

    @PostMapping("/incident/{iid}/officer/{oid}/add")
    public void addOfficer(@PathVariable int iid, @PathVariable int oid) {
        Optional<Incident> incident = incidentRepository.findById(iid);
        Optional<Employee> employee = employeeRepository.findById(oid);

        if (incident.isEmpty() || employee.isEmpty())
            return;

        incident.get().getOfficers().add(employee.get());
        incidentRepository.save(incident.get());
    }

    @GetMapping("/incident/{iid}/suspects")
    public Set<Person> getSuspects(@PathVariable int iid) {
        Optional<Incident> incident = incidentRepository.findById(iid);

        if (incident.isEmpty())
            return null;

        return incident.get().getSuspects();
    }

    @GetMapping("/incident/{iid}/witnesses")
    public Set<Person> getWitnesses(@PathVariable int iid) {
        Optional<Incident> incident = incidentRepository.findById(iid);

        if (incident.isEmpty())
            return null;

        return incident.get().getWitnesses();
    }

    @PostMapping("/incident/{iid}/suspect/{regNum}/add")
    public void addSuspect(@PathVariable int iid, @PathVariable String regNum) {
        Optional<Incident> incident = incidentRepository.findById(iid);
        Person person = personRepository.findByRegNum(regNum);

        if (incident.isEmpty() || person == null)
            return;

        incident.get().getSuspects().add(person);
        incidentRepository.save(incident.get());
    }

    @PostMapping("/incident/{iid}/witness/{regNum}/add")
    public void addWitness(@PathVariable int iid, @PathVariable String regNum) {
        Optional<Incident> incident = incidentRepository.findById(iid);
        Person person = personRepository.findByRegNum(regNum);

        if (incident.isEmpty() || person == null)
            return;

        incident.get().getWitnesses().add(person);
        incidentRepository.save(incident.get());
    }

    @DeleteMapping("/incident/{iid}/suspect/{regNum}/delete")
    public void deleteSuspect(@PathVariable int iid, @PathVariable String regNum) {
        Optional<Incident> incident = incidentRepository.findById(iid);
        Person person = personRepository.findByRegNum(regNum);

        if (incident.isEmpty() || person == null)
            return;

        incident.get().getSuspects().remove(person);
        incidentRepository.save(incident.get());
    }

    @DeleteMapping("/incident/{iid}/witness/{regNum}/delete")
    public void deleteWitness(@PathVariable int iid, @PathVariable String regNum) {
        Optional<Incident> incident = incidentRepository.findById(iid);
        Person person = personRepository.findByRegNum(regNum);

        if (incident.isEmpty() || person == null)
            return;

        incident.get().getWitnesses().remove(person);
        incidentRepository.save(incident.get());
    }

    @DeleteMapping("/incident/{iid}/officer/{oid}/delete")
    public void deleteOfficer(@PathVariable int iid, @PathVariable int oid) {
        Optional<Incident> incident = incidentRepository.findById(iid);
        Optional<Employee> employee = employeeRepository.findById(oid);

        if (incident.isEmpty() || employee.isEmpty())
            return;

        incident.get().getOfficers().remove(employee.get());
        incidentRepository.save(incident.get());
    }

    @GetMapping("/incidents/person/{regNum}")
    public List<Integer> getByPerson(@PathVariable String regNum) {
        List<Incident> incidents = incidentRepository.findAll();
        Person person = personRepository.findByRegNum(regNum);
        List<Integer> incidentIds = new ArrayList<>();


        if (person == null)
            return null;

        for (Incident incident : incidents) {
            if (incident.getWitnesses().contains(person) || incident.getSuspects().contains(person))
                incidentIds.add(incident.getId());
        }

        return  incidentIds;
    }
}
