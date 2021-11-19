package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByCode(Integer code);

    boolean existsByShortTitle(String shortTitle);

}
