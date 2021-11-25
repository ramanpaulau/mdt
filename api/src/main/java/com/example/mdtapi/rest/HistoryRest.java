package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.History;
import com.example.mdtapi.models.Inventory;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.EmployeeRepository;
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

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class HistoryRest {

    @Autowired
    private final HistoryRepository historyRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    @Autowired
    private final InventoryRepository inventoryRepository;

    public HistoryRest(HistoryRepository historyRepository, EmployeeRepository employeeRepository, DepartmentRepository departmentRepository, InventoryRepository inventoryRepository) {
        this.historyRepository = historyRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @GetMapping("/history")
    public List<History> all() {
        return historyRepository.findAllOrderByDate();
    }

    @PostMapping("/history")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        int employeeId, amount, departmentCode;
        String description;
        boolean action;
        JSONObject subchapter = new JSONObject(request);
        try {
            employeeId = subchapter.getInt("employee");
            departmentCode = subchapter.getInt("department");
            amount = subchapter.getInt("amount");
            if (amount < 0 || employeeId < 0)
                throw new JSONException("Negative value");
            description = subchapter.getString("description");
            action = subchapter.getBoolean("action");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("Employee doesn't exist");
            return res;
        }

        Department department = departmentRepository.findByCode(departmentCode);
        if (department == null) {
            res.setSuccess(false);
            res.setMessage("Department doesn't exist");
            return res;
        }

        Inventory inventory = inventoryRepository.findByDescriptionAndDepartment(description, department);
        if (inventory == null) {
            res.setSuccess(false);
            res.setMessage("Inventory doesn't exist");
            return res;
        }

        inventory.setAmount((action) ? inventory.getAmount() + amount : inventory.getAmount() - amount);
        if (inventory.getAmount() > 0)
            inventoryRepository.save(inventory);
        else
            inventoryRepository.delete(inventory);

        History history = new History(new Date(), description, amount, action, department, employee.get());
        historyRepository.save(history);

        return res;
    }
}