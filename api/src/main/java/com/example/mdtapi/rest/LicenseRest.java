package com.example.mdtapi.rest;

import com.example.mdtapi.models.License;
import com.example.mdtapi.repositories.LicenseRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LicenseRest {

    @Autowired
    private final LicenseRepository licenseRepository;

    public LicenseRest(LicenseRepository licenseRepository) {
        this.licenseRepository = licenseRepository;
    }

    @GetMapping("/licenses")
    public List<License> all() {
        return licenseRepository.findAll();
    }

    @PostMapping("/license")
    public ResponseMessage insert(@RequestBody String request) {
        ResponseMessage res = ResponseMessage.OKMessage();

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

        License license = new License(name, description);
        licenseRepository.save(license);
        return res;
    }
}
