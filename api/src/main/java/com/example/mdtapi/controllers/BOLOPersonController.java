package com.example.mdtapi.controllers;

import com.example.mdtapi.models.BOLORecord;
import com.example.mdtapi.models.Incident;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.Vehicle;
import com.example.mdtapi.repositories.IncidentRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.repositories.VehicleRepository;
import com.example.mdtapi.utils.BOLOResponse;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Controller
public class BOLOPersonController {
    @Autowired
    private final IncidentRepository incidentRepository;

    @Autowired
    private final PersonRepository personRepository;

    public BOLOPersonController(IncidentRepository incidentRepository, PersonRepository personRepository) {
        this.incidentRepository = incidentRepository;
        this.personRepository = personRepository;
    }

    @MessageMapping("/incident/bolo/persons")
    @SendTo("/ws/bolo/persons")
    public BOLOResponse<BOLORecord<Person>> insert(@RequestBody String request) throws Exception {
        int incidentId;
        String personRegNum;
        JSONObject subchapter = new JSONObject(request);
        try {
            incidentId = subchapter.getInt("incidentId");
            if (incidentId < 0)
                throw new JSONException("Negative value");
            personRegNum = subchapter.getString("citizenRegNum");
        } catch (JSONException ignored) {
            return null;
        }

        Optional<Incident> incident = incidentRepository.findById(incidentId);
        if (incident.isEmpty())
            return null;

        Person person = personRepository.findByRegNum(personRegNum);
        if (person == null)
            return null;


        if (incident.get().getBoloPersons().contains(person))
            return null;

        incident.get().getBoloPersons().add(person);
        incidentRepository.save(incident.get());

        BOLOResponse<BOLORecord<Person>> response = new BOLOResponse<>();
        BOLORecord<Person> record = new BOLORecord<>(incident.get(), person);

        response.setAction("add");
        response.setBody(record);
        return response;
    }

    @MessageMapping("/incident/bolo/persons/delete")
    @SendTo("/ws/bolo/persons")
    public BOLOResponse<BOLORecord<Person>> delete(@RequestBody String request) throws Exception {
        int incidentId;
        String personRegNum;
        JSONObject subchapter = new JSONObject(request);
        try {
            incidentId = subchapter.getInt("incidentId");
            if (incidentId < 0)
                throw new JSONException("Negative value");
            personRegNum = subchapter.getString("citizenRegNum");
        } catch (JSONException ignored) {
            return null;
        }

        Optional<Incident> incident = incidentRepository.findById(incidentId);
        if (incident.isEmpty())
            return null;

        Person person = personRepository.findByRegNum(personRegNum);
        if (person == null)
            return null;


        incident.get().getBoloPersons().remove(person);
        incidentRepository.save(incident.get());

        BOLOResponse<BOLORecord<Person>> response = new BOLOResponse<>();
        BOLORecord<Person> record = new BOLORecord<>(incident.get(), person);

        response.setAction("delete");
        response.setBody(record);
        return response;
    }
}
