package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Call;
import com.example.mdtapi.models.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CallRepository extends JpaRepository<Call, Integer> {
    @Query(value = "SELECT * FROM call ORDER BY time DESC", nativeQuery = true)
    List<Call> findAllOrderByTime();
}
