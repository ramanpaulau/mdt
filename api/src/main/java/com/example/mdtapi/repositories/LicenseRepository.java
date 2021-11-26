package com.example.mdtapi.repositories;

import com.example.mdtapi.models.License;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LicenseRepository extends JpaRepository<License, Integer> {
}
