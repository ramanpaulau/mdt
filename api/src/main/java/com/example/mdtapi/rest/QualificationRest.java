package com.example.mdtapi.rest;

import com.example.mdtapi.models.Qualification;
import com.example.mdtapi.repositories.QualificationRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class QualificationRest {

    @Autowired
    private final QualificationRepository qualificationRepository;

    public QualificationRest(QualificationRepository qualificationRepository) {
        this.qualificationRepository = qualificationRepository;
    }

    @GetMapping("/qualifications")
    public List<Qualification> all() {
        return qualificationRepository.findAll();
    }

    @PostMapping("/qualification")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = new ResponseMessage();

        String name, description;
        JSONObject subchapter = new JSONObject(request);
        try {
            name = subchapter.getString("name");
            description = subchapter.getString("description");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        Qualification qualification = new Qualification(name, description);
        qualificationRepository.save(qualification);
        return res;
    }
}
