package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.EmployeeState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeStateRepository extends JpaRepository<EmployeeState, Employee> {
    EmployeeState findByEmployee(Employee employee);
}
