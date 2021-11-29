package com.example.mdtapi.controllers;

import com.example.mdtapi.models.Incident;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.Vehicle;
import com.example.mdtapi.repositories.IncidentRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.repositories.VehicleRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

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
    public Person insert(@RequestBody String request) throws Exception {
        System.out.println(request);

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

        Incident incident1 = incident.get();
        incident1.getBoloPersons().add(person);
        incidentRepository.save(incident1);

        return person;
    }
}
