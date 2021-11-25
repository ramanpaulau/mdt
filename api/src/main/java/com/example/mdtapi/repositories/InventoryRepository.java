package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    Inventory findByDescriptionAndDepartment(String description, Department department);

}
