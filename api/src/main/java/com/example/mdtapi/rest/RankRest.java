package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Rank;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.RankRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
public class RankRest {

    @Autowired
    private final RankRepository rankRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    public RankRest(RankRepository rankRepository, DepartmentRepository departmentRepository) {
        this.rankRepository = rankRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/ranks")
    public List<Rank> all() {
        return rankRepository.findAll();
    }

    @PostMapping("/rank")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = new ResponseMessage();

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
}
