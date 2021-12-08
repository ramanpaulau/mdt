package com.example.mdtapi.controllers;

import com.example.mdtapi.models.*;
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
    public BOLOResponse<BOLORecord<Vehicle>> insert(@RequestBody String request) throws Exception {
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

        if (incident.get().getBoloVehicles().contains(vehicle))
            return null;

        incident.get().getBoloVehicles().add(vehicle);
        incidentRepository.save(incident.get());

        BOLOResponse<BOLORecord<Vehicle>> response = new BOLOResponse<>();
        BOLORecord<Vehicle> record = new BOLORecord<>(incident.get(), vehicle);

        response.setAction("add");
        response.setBody(record);
        return response;
    }

    @MessageMapping("/incident/bolo/vehicles/delete")
    @SendTo("/ws/bolo/vehicles")
    public BOLOResponse<BOLORecord<Vehicle>> delete(@RequestBody String request) throws Exception {
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

        incident.get().getBoloVehicles().remove(vehicle);
        incidentRepository.save(incident.get());

        BOLOResponse<BOLORecord<Vehicle>> response = new BOLOResponse<>();
        BOLORecord<Vehicle> record = new BOLORecord<>(incident.get(), vehicle);

        response.setAction("delete");
        response.setBody(record);
        return response;
    }
}
