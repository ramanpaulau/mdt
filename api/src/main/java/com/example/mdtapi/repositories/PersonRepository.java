package com.example.mdtapi.repositories;

import com.example.mdtapi.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.Collection;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    Person findByRegNum(String regNum);
}