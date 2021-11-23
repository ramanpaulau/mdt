package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Unit;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.UnitRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UnitRest {

    @Autowired
    private final UnitRepository unitRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    public UnitRest(UnitRepository unitRepository, DepartmentRepository departmentRepository) {
        this.unitRepository = unitRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/units")
    public List<Unit> all() {
        return unitRepository.findAll();
    }

    @PostMapping("/unit")
    public ResponseMessage insert(@RequestBody Unit unit) {
        ResponseMessage res = new ResponseMessage();

        Department department = departmentRepository.findByCode(unit.getDepartmentCode());

        if (department == null) {
            res.setSuccess(false);
            res.setMessage("Wrong department");
        }

        unit.setDepartment(department);
        unitRepository.save(unit);
        return res;
    }
}
