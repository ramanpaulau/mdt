package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {

    Department findByCode(Integer code);

    boolean existsByCode(Integer code);

    boolean existsByShortTitle(String shortTitle);

    List<Department> findAllByOrderByCodeAsc();

}
