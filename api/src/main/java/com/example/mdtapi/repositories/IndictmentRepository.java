package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Indictment;
import com.example.mdtapi.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndictmentRepository extends JpaRepository<Indictment, Integer> {
    List<Indictment> findByPerson(Person person);
}
