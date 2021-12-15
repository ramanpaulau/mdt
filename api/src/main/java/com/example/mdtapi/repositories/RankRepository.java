package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Rank;
import com.example.mdtapi.models.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RankRepository extends JpaRepository<Rank, String> {
    Rank findByTitle(String title);

    Rank findByDepartmentAndTitle(Department department, String title);
}
