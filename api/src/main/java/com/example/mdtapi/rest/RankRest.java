package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.Rank;
import com.example.mdtapi.models.Unit;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.EmployeeRepository;
import com.example.mdtapi.repositories.RankRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RankRest {

    @Autowired
    private final RankRepository rankRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    @Autowired
    private final EmployeeRepository employeeRepository;

    public RankRest(RankRepository rankRepository, DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
        this.rankRepository = rankRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/ranks")
    public List<Rank> all() {
        return rankRepository.findAll();
    }

    @PostMapping("/rank")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

        short salary;
        String title;
        int departmentCode;
        JSONObject subchapter = new JSONObject(request);
        try {
            salary = (short) subchapter.getInt("salary");
            departmentCode = subchapter.getInt("department");
            if (salary < 0 || departmentCode < 0)
                throw new JSONException("Negative value");
            title = subchapter.getString("title");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Department department = departmentRepository.findByCode(departmentCode);
        if (department == null) {
            res.setSuccess(false);
            res.setMessage("Department don't exist");
            return res;
        }

        Rank rank = new Rank(title, salary, department);
        rankRepository.save(rank);
        return res;
    }


    @DeleteMapping("/rank/{title}/department/{departmentCode}")
    public void removeUnits(@PathVariable String title, @PathVariable int departmentCode) {
        Department department = departmentRepository.findByCode(departmentCode);
        if (department == null)
            return;

        Rank rank = rankRepository.findByDepartmentAndTitle(department, title);
        if (rank == null)
            return;

        List<Employee> employees = employeeRepository.findAll();
        for (Employee e : employees) {
            if (e.getRank().equals(title))
                return;
        }

        rankRepository.delete(rank);
    }
}
