package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Indictment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndictmentRepository extends JpaRepository<Indictment, Integer> {
}
