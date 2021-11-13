package com.example.mdtapi.rest;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:${mdt.cors-port}")
@RestController
public class EmployeeRest {

    @Autowired
    private final EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public EmployeeRest(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @GetMapping("/emp")
    public List<Employee> all() {
        List<Employee> res = employeeRepository.findAll();
        for (Employee e : res) {
            System.out.println(e);
        }
        return res;
    }

    @PostMapping("/emp/{id}/{name}")
    public boolean update(@PathVariable Long id, @PathVariable String name) {
        if (employeeRepository.findById(id).isEmpty())
            return false;
        Employee emp = employeeRepository.findById(id).get();
        emp.setName(name);
        employeeRepository.save(emp);
        return true;
    }

    @PostMapping("/login")
    @ResponseBody
    public JWT login(@RequestBody LoginData ld) {
        Employee e = employeeRepository.findByTag(ld.getTag());

        if (e == null)
            return new JWT("", false);

        boolean res = passwordEncoder.matches(ld.getPassword(), e.getPassword());

        return (res)?new JWT(e.getName(), true):new JWT("", false);
    }

    @PostConstruct
    public void init() {
        if (employeeRepository.findByTag(0) != null)
            return;

        Employee admin = new Employee();
        admin.setTag(0);
        admin.setName("Admin");
        admin.setSurname("Admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setBirthdate(new Date(1970, Calendar.JANUARY, 1));

        employeeRepository.save(admin);
    }
}
