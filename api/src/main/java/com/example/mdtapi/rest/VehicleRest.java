package com.example.mdtapi.rest;

import com.example.mdtapi.models.Vehicle;
import com.example.mdtapi.models.VehiclePlateNumbers;
import com.example.mdtapi.repositories.VehicleRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class VehicleRest {
    @Autowired
    private final VehicleRepository vehicleRepository;

    public VehicleRest(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping("/vehicles")
    public List<Vehicle> all() {
        return vehicleRepository.findAll();
    }

    @GetMapping("/vehicles/plateNum")
    public List<VehiclePlateNumbers> allByPlateNum() {
        return vehicleRepository.findAllProjectedBy();
    }

    @PostMapping("/vehicle")
    public ResponseMessage insert(@RequestBody Vehicle vehicle) {
        ResponseMessage res = ResponseMessage.OKMessage();

        vehicleRepository.save(vehicle);
        return res;
    }

    @GetMapping("/vehicles/is_plateNum_available/{plateNum}")
    public ResponseMessage plateNum(@PathVariable String plateNum) {
        ResponseMessage res = ResponseMessage.OKMessage();

        if (vehicleRepository.existsByPlateNum(plateNum))
            res.setSuccess(false);
        return res;
    }

    @GetMapping("/vehicles/is_vin_available/{vin}")
    public ResponseMessage vin(@PathVariable Integer vin) {
        ResponseMessage res = ResponseMessage.OKMessage();

        if (vehicleRepository.existsByVin(vin))
            res.setSuccess(false);
        return res;
    }
}
