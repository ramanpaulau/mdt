package com.example.mdtapi.models;

import java.time.LocalDate;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Person")
public class Person {

	public enum State {
		ALIVE, DEAD, MISSING
	}

	private @Id String regNum;
	private String name;
	private String surname;
	private String password;
	private LocalDate birthdate;
	private String phoneNumber;
	private boolean admin;
	private State state;

	public Person() {
	}

	public Person(String regNum, String name, String surname, String password, LocalDate birthdate, String phoneNumber, boolean admin, State state) {
		this.regNum = regNum;
		this.name = name;
		this.surname = surname;
		this.password = password;
		this.birthdate = birthdate;
		this.phoneNumber = phoneNumber;
		this.admin = admin;
		this.state = state;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Person person = (Person) o;
		return admin == person.admin && Objects.equals(regNum, person.regNum) && Objects.equals(name, person.name) && Objects.equals(surname, person.surname) && Objects.equals(password, person.password) && Objects.equals(birthdate, person.birthdate) && Objects.equals(phoneNumber, person.phoneNumber) && state == person.state;
	}

	@Override
	public int hashCode() {
		return Objects.hash(regNum, name, surname, birthdate);
	}

	public String getRegNum() {
		return regNum;
	}

	public void setRegNum(String regNum) {
		this.regNum = regNum;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public LocalDate getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(LocalDate birthdate) {
		this.birthdate = birthdate;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	public State getState() {
		return state;
	}

	public void setState(State state) {
		this.state = state;
	}

	@Override
	public String toString() {
		return "Person{" +
				"regNum='" + regNum + '\'' +
				", name='" + name + '\'' +
				", surname='" + surname + '\'' +
				", password='" + password + '\'' +
				", birthdate=" + birthdate +
				", phoneNumber='" + phoneNumber + '\'' +
				", admin=" + admin +
				", state=" + state +
				'}';
	}
}
