package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    boolean existsByTagAndDepartmentCode(Integer tag, Integer departmentCode);

    List<Employee> findByDepartment(Department department);

    Employee findByPerson(Person person);

    List<Employee> findAllByOrderByTagAsc();
}
