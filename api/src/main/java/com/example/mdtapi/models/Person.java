package com.example.mdtapi.models;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.*;

@Entity
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

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
			name = "person_license",
			joinColumns = { @JoinColumn(name = "license_id") },
			inverseJoinColumns = { @JoinColumn(name = "person_regNum") }
	)
	private Set<License> licenses = new HashSet<>();

	@OneToMany(targetEntity = Vehicle.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "vehicle_owner")
	private Set<Vehicle> vehicles;

	public Person() {
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

	public String getFullName() {
		return name + " " + surname;
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

	public Set<License> getLicenses() {
		return licenses;
	}

	public void setLicenses(Set<License> licenses) {
		this.licenses = licenses;
	}

	public void removeLicense(License license) {
		this.licenses.remove(license);
	}

	public Set<Vehicle> getVehicles() {
		return vehicles;
	}

	public void setVehicles(Set<Vehicle> vehicles) {
		this.vehicles = vehicles;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Person person = (Person) o;
		return admin == person.admin && Objects.equals(regNum, person.regNum) && Objects.equals(name, person.name) && Objects.equals(surname, person.surname) && Objects.equals(password, person.password) && Objects.equals(birthdate, person.birthdate) && Objects.equals(phoneNumber, person.phoneNumber) && state == person.state && Objects.equals(licenses, person.licenses) && Objects.equals(vehicles, person.vehicles);
	}

	@Override
	public int hashCode() {
		return Objects.hash(regNum, name, surname, password, birthdate, phoneNumber, admin, state, licenses, vehicles);
	}
}


