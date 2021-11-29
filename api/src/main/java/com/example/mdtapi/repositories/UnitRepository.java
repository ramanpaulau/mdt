package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, String> {
    Optional<Unit> getByAbbreviation(String abbreviation);
}
