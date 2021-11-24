import React from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form, Field, ErrorMessage } from "formik";

const customStyles = {
    container: (provided) => ({
        ...provided,
        width: "250px"
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#3676F5",
        border: "none"
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#FFFFFF"
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#FFFFFF"
    }),
    menu: (provided) => ({
        ...provided,
        color: "#FFFFFF",
        backgroundColor: "#3676F5",
        border: "none"
    }),
    input: (provided) => ({
        ...provided,
        color: "#FFFFFF"
    }),
    option: (provided) => ({
        ...provided,
        backgroundColor: "#3676F5",
        "&:hover": {
            backgroundColor: "#2551A8"
        }
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        color: "#FFFFFF"
    }),
    noOptionsMessage: (provided) => ({
        ...provided,
        color: "#FFFFFF"
    })
}

class Employees extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            departments: [],
            employees: [],
            ranks: [],
            department: -1,
            selectedRank: null,
            selectedPerson: null,
            tag: 0,
        }

        this.sendButton = React.createRef();
    }

    componentDidMount = async () => {
        await axios.all([
            axios.get("http://localhost:8081/departments"),
            axios.get("http://localhost:8081/employees"),
            axios.get("http://localhost:8081/ranks")])
            .then(axios.spread((firstResponse, secondResponse, thirdResponse) => {
                this.setState({
                    departments: firstResponse.data,
                    department: (firstResponse.data[0]) ? firstResponse.data[0].code : -1,
                    employees: secondResponse.data,
                    ranks: thirdResponse.data,
                })
            }))
            .catch(error => console.log(error));
    }

    loadEmployees = async () => {
        await axios.get("http://localhost:8081/employees").then(res => {
            this.setState({
                employees: res.data
            })
        });
    }

    addEmployee = () => {
        let tmp = {
            regNum: this.state.selectedPerson.value,
            rank: this.state.selectedRank.value,
            tag: this.state.tag,
            department: this.state.department
        };
        axios.post("http://localhost:8081/employee",
            JSON.stringify(tmp),
            { headers: { 'Content-Type': 'text/plain' } })
            .then(res => {
                if (res.data.success)
                    this.loadEmployees();
                else
                    console.log(res.data.message);
            });
    }

    clearForm = () => {
        this.setState({ selectedPerson: null, selectedRank: null, tag: 0 }, () => console.log(this.state.tag));
    }

    render() {
        console.log(this.state.employees);
        let filteredRanks = [];
        if (this.state.department !== -1)
            filteredRanks = this.state.ranks.filter(r => r.department === this.state.department)

        let filteredEmployees = [];
        if (this.state.department !== -1)
            filteredEmployees = this.state.employees.filter(e => e.department === this.state.department)

        return (
            <div className="employees">
                <div className="block employee-list">
                    <div className="title title-select">
                        <h3>Employees</h3>
                        <div>
                            <select onChange={(e) => { this.setState({ department: parseInt(e.target.value) }); this.clearForm(); }} value={this.state.department}>
                                {this.state.departments.map(d =>
                                    <option key={d.code} value={d.code}>{d.shortTitle}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="table-scroll">
                        {filteredEmployees.map(e =>
                            <ul key={e.tag}>
                                <li>{this.state.department}-{e.tag}</li>
                            </ul>
                        )}
                    </div>
                </div>
                <div className="block employee-editor">
                    <div className="title">
                        <h3>
                            <Link
                                to={"/employees"}
                                className="link"
                                onClick={() => this.clearForm()}>
                                New
                            </Link>
                        </h3>
                        <h3 onClick={() => this.addEmployee()}>Send</h3>
                    </div>
                    <div className="table-scroll">
                        <Formik>
                            {() => (
                                <Form>
                                    <div>
                                        <Select styles={customStyles}
                                            options={this.props.citizens.map(c => (
                                                {
                                                    value: c.regNum,
                                                    label: c.regNum + " / " + c.name + " " + c.surname
                                                })
                                            )}
                                            value={this.state.selectedPerson}
                                            onChange={(e) => this.setState({ selectedPerson: e })}
                                            placeholder="Person"
                                            noOptionsMessage={() => "Citizen not found"} />
                                        <span className="floating-label active-label">Person</span>
                                    </div>
                                    <div>
                                        <Select styles={customStyles}
                                            options={filteredRanks.map(r => (
                                                {
                                                    value: r.title,
                                                    label: r.title
                                                })
                                            )}
                                            value={this.state.selectedRank}
                                            onChange={(e) => this.setState({ selectedRank: e })}
                                            placeholder="Rank"
                                            noOptionsMessage={() => "Rank not found"} />
                                        <span className="floating-label active-label">Rank</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" name="tag" value={this.state.tag} onChange={(e) => this.setState({ tag: e.target.value })} />
                                        <ErrorMessage name="tag" className="error-label" component="div" />
                                        <span className="floating-label active-label">Tag</span>
                                    </div>
                                    <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="block employee-work-hours">
                    <h3>Work hours</h3>
                    <div className="table-scroll">
                    </div>
                </div>
            </div>
        )
    }
}

export default Employees;