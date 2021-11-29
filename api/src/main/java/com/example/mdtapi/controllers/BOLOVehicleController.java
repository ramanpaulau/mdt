package com.example.mdtapi.controllers;

import com.example.mdtapi.models.Incident;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.PersonMessage;
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
public class BOLOVehicleController {
    @Autowired
    private final IncidentRepository incidentRepository;

    @Autowired
    private final VehicleRepository vehicleRepository;

    public BOLOVehicleController(IncidentRepository incidentRepository, VehicleRepository vehicleRepository) {
        this.incidentRepository = incidentRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @MessageMapping("/incident/bolo/vehicles")
    @SendTo("/ws/bolo/vehicles")
    public Vehicle insert(@RequestBody String request) throws Exception {
        System.out.println(request);

        int incidentId;
        String plateNum;
        JSONObject subchapter = new JSONObject(request);
        try {
            incidentId = subchapter.getInt("incidentId");
            if (incidentId < 0)
                throw new JSONException("Negative value");
            plateNum = subchapter.getString("vehiclePlateNum");
        } catch (JSONException ignored) {
            return null;
        }

        Optional<Incident> incident = incidentRepository.findById(incidentId);
        if (incident.isEmpty())
            return null;

        Vehicle vehicle = vehicleRepository.findByPlateNum(plateNum);
        if (vehicle == null)
            return null;

        Incident incident1 = incident.get();
        incident1.getBoloVehicles().add(vehicle);
        incidentRepository.save(incident1);

        return vehicle;
    }
}
