package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Person;
import com.example.mdtapi.models.PersonView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, String> {

    Person findByRegNum(String regNum);

    boolean existsByRegNum(String regNUm);

    List<PersonView> findAllProjectedBy();

    List<PersonView> findAllProjectedByOrderByRegNum();
}