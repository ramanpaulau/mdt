package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FineRepository extends JpaRepository<Fine, Integer> {
}
