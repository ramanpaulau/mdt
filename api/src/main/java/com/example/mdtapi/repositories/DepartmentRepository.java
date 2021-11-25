package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {

    Department findByCode(Integer code);

    boolean existsByCode(Integer code);

    boolean existsByShortTitle(String shortTitle);

    List<Department> findAllByOrderByCodeAsc();

}
