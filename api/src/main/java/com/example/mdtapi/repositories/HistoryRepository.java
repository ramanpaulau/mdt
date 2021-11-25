package com.example.mdtapi.repositories;

import com.example.mdtapi.models.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, String> {

    @Query(value = "SELECT * FROM history ORDER BY date DESC", nativeQuery = true)
    List<History> findAllOrderByDate();
}
