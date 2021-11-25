package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

}
