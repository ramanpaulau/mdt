package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Collection;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Employee findByTag(Integer tag);

}