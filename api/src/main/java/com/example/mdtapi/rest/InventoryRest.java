package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.History;
import com.example.mdtapi.models.Inventory;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.HistoryRepository;
import com.example.mdtapi.repositories.InventoryRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class InventoryRest {

    @Autowired
    private final InventoryRepository inventoryRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    public InventoryRest(InventoryRepository inventoryRepository, DepartmentRepository departmentRepository) {
        this.inventoryRepository = inventoryRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/inventory")
    public List<Inventory> all() {
        return inventoryRepository.findAll();
    }

    @PostMapping("/inventory/record")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = new ResponseMessage();

        int amount, departmentCode;
        String description;
        JSONObject subchapter = new JSONObject(request);
        try {
            amount = subchapter.getInt("amount");
            departmentCode = subchapter.getInt("department");
            if (amount < 0 || departmentCode < 0)
                throw new JSONException("Negative value");
            description = subchapter.getString("description");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Department dep = departmentRepository.findByCode(departmentCode);
        if (dep == null) {
            res.setSuccess(false);
            res.setMessage("Department don't exist");
            return res;
        }

        Inventory inventory = new Inventory();
        inventory.setAmount(amount);
        inventory.setDepartment(dep);
        inventory.setDescription(description);

        inventoryRepository.save(inventory);
        return res;
    }
}