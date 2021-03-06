package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Call;
import com.example.mdtapi.models.Employee;
import com.example.mdtapi.models.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Integer> {
    List<Incident> findAllByOrderByIdDesc();

    List<Incident> findBySupervisor(Employee supervisor);
}
