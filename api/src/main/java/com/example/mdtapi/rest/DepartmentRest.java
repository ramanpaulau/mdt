package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.repositories.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DepartmentRest {
    @Autowired
    private DepartmentRepository departmentRepository;

    public DepartmentRest(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/departments")
    public List<Department> all() {
        return departmentRepository.findAll();
    }

    @PostMapping ("/department")
    public void insert(@RequestBody Department department) {
        System.out.println(department);
        departmentRepository.save(department);
    }

    @GetMapping("/is_depCode_available/{code}")
    public boolean isDepCodeAvailable(@PathVariable Integer code) {
        return !departmentRepository.existsByCode(code);
    }

    @GetMapping("/is_shortTitle_available/{shortTitle}")
    public boolean isShortTitleAvailable(@PathVariable String shortTitle) {
        return !departmentRepository.existsByShortTitle(shortTitle);
    }
}
