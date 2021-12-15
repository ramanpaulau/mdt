package com.example.mdtapi.rest;

import com.example.mdtapi.models.Call;
import com.example.mdtapi.models.Incident;
import com.example.mdtapi.repositories.CallRepository;
import com.example.mdtapi.repositories.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class CallRest {
    @Autowired
    private final CallRepository callRepository;

    public CallRest(CallRepository callRepository) {
        this.callRepository = callRepository;
    }

    @GetMapping("/calls")
    private List<Call> all() {
        return callRepository.findAllByOrderByIdDesc();
    }
}
