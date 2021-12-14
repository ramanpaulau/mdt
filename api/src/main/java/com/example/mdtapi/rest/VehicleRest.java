package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Vehicle;
import com.example.mdtapi.models.VehiclePlateNumbers;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.VehicleRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class VehicleRest {
    @Autowired
    private final VehicleRepository vehicleRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    public VehicleRest(VehicleRepository vehicleRepository, DepartmentRepository departmentRepository) {
        this.vehicleRepository = vehicleRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/vehicles")
    public List<Vehicle> all() {
        return vehicleRepository.findAllByOrderByNameAsc();
    }

    @GetMapping("/vehicles/free")
    public List<Vehicle> allFree() {
        return vehicleRepository.findByVehicleOwnerNull();
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

    @PostMapping("/vehicle/{vin}/confiscate/{depCode}")
    public ResponseMessage confiscate(@PathVariable Integer vin, @PathVariable Integer depCode) {
        ResponseMessage res = ResponseMessage.OKMessage();

        Vehicle vehicle = vehicleRepository.findByVin(vin);
        if (vehicle == null) {
            res.setSuccess(false);
            res.setMessage("Vehicle not found");
            return res;
        }

        Department department = departmentRepository.findByCode(depCode);
        if (department == null) {
            res.setSuccess(false);
            res.setMessage("Department not found");
            return res;
        }

        vehicle.setDepartment(department);
        vehicleRepository.save(vehicle);
        return res;
    }

    @PostMapping("/vehicle/{vin}/confiscate/remove")
    public ResponseMessage confiscate(@PathVariable Integer vin) {
        ResponseMessage res = ResponseMessage.OKMessage();

        Vehicle vehicle = vehicleRepository.findByVin(vin);
        if (vehicle == null) {
            res.setSuccess(false);
            res.setMessage("Vehicle not found");
            return res;
        }

        vehicle.setDepartment(null);
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
