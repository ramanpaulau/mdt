package com.example.mdtapi.repositories;

import com.example.mdtapi.models.PasswordToken;
import com.example.mdtapi.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordTokenRepository extends JpaRepository<PasswordToken, String> {

    PasswordToken findByPerson(Person person);

}
