package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    boolean existsByTagAndDepartmentCode(Integer tag, Integer departmentCode);

    Employee findByPerson(Person person);

    List<Employee> findAllByOrderByTagAsc();
}
