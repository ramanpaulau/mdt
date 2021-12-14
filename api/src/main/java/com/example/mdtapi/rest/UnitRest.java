package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Unit;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.UnitRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/units/department/{code}")
    public List<Unit> getUnits(@PathVariable Integer code) {
        Department department = departmentRepository.findByCode(code);
        if (department == null)
            return null;
        return unitRepository.findByDepartment(department);
    }

    @PostMapping("/unit")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        String title, abbreviation, description;
        int departmentCode;
        JSONObject subchapter = new JSONObject(request);
        try {
            departmentCode = subchapter.getInt("department");
            if (departmentCode < 0)
                throw new JSONException("Negative value");
            title = subchapter.getString("title");
            abbreviation = subchapter.getString("abbreviation");
            description = subchapter.getString("description");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Department department = departmentRepository.findByCode(departmentCode);
        if (department == null) {
            res.setSuccess(false);
            res.setMessage("Wrong department");
            return res;
        }

        Unit unit = new Unit(abbreviation, title, description);
        unit.setDepartment(department);
        unitRepository.save(unit);
        return res;
    }
}
