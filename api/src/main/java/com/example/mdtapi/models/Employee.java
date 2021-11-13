package com.example.mdtapi.models;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Employee")
public class Employee {

	private @Id @GeneratedValue Long id;
	private String name;
	private String surname;
	private String password;
	private Date birthdate;
	private Integer tag;

	public Employee() {
	}

	public Employee(String name, String surname, String password, Date birthdate, Integer tag) {
		this.name = name;
		this.surname = surname;
		this.password = password;
		this.birthdate = birthdate;
		this.tag = tag;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Employee employee = (Employee) o;
		return Objects.equals(id, employee.id) &&
			Objects.equals(name, employee.name) &&
			Objects.equals(surname, employee.surname) &&
			Objects.equals(tag, employee.tag);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, name, surname, tag);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Date getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}

	public Integer getTag() {
		return this.tag;
	}

	public void setTag(Integer tag) {
		this.tag = tag;
	}

	@Override
	public String toString() {
		return "Employee{" +
			"id=" + id +
			", name='" + name + '\'' +
			", surname='" + surname + '\'' +
			", description='" + tag + '\'' +
			'}';
	}
}
