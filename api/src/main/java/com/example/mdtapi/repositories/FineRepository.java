package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Fine;
import com.example.mdtapi.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Integer> {
    List<Fine> findByPerson(Person person);
}
