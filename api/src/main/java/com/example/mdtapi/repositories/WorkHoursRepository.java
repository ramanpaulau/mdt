package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.WorkHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkHoursRepository extends JpaRepository<WorkHours, Integer> {
    WorkHours findByEmployeeAndEndTimeIsNull(Employee employee);

    List<WorkHours> findByEmployeeAndEndTimeIsNotNull(Employee employee);
}
