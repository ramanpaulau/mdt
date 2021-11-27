package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Vehicle;
import com.example.mdtapi.models.VehiclePlateNumbers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    boolean existsByPlateNum(String plateNum);

    boolean existsByVin(Integer vin);

    List<VehiclePlateNumbers> findAllProjectedBy();

    @Query(value = "SELECT * FROM vehicle WHERE vehicle_owner IS NULL", nativeQuery = true)
    List<Vehicle> findByVehicleOwnerNull();

    Vehicle findByPlateNum(String plateNum);
}
