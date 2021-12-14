package com.example.mdtapi.rest;

import com.example.mdtapi.models.License;
import com.example.mdtapi.models.Person;
import com.example.mdtapi.repositories.LicenseRepository;
import com.example.mdtapi.repositories.PersonRepository;
import com.example.mdtapi.utils.ResponseMessage;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class LicenseRest {

    @Autowired
    private final LicenseRepository licenseRepository;

    @Autowired
    private final PersonRepository personRepository;

    public LicenseRest(LicenseRepository licenseRepository, PersonRepository personRepository) {
        this.licenseRepository = licenseRepository;
        this.personRepository = personRepository;
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

        if (licenseRepository.existsByName(name)) {
            res.setSuccess(false);
            res.setMessage("Name occupied");
            return res;
        }

        License license = new License(name, description);
        licenseRepository.save(license);
        return res;
    }

    @DeleteMapping ("/license/{id}")
    public ResponseMessage remove(@PathVariable Integer id) {
        ResponseMessage res = ResponseMessage.OKMessage();

        Optional<License> license = licenseRepository.findById(id);
        if (license.isEmpty()) {
            res.setSuccess(false);
            res.setMessage("License not found.");
            return res;
        }

        List <Person> persons = personRepository.findAll();
        for (Person p : persons) {
            if (p.getLicenses().contains(license.get())) {
                res.setSuccess(false);
                res.setMessage("All licenses must be removed.");
                return res;
            }
        }

        licenseRepository.delete(license.get());
        return res;
    }
}
