package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Integer> {
    List<Incident> findBySupervisor(Employee supervisor);
}
