import React from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";

export const customStyles = {
    container: (provided) => ({
        ...provided,
        width: "250px"
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#3676F5",
        border: "none",
        lineHeight: "30px"
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
        border: "none",
        zIndex: 2
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
            qualifications: [],
            employees: [],
            ranks: [],
            department: null,
            selectedRank: null,
            selectedCitizens: null,
            tag: 0,
            isLoading: true
        }

        this.sendButton = React.createRef();
    }

    componentDidMount = async () => {
        await axios.all([
            axios.get("http://localhost:8081/departments"),
            axios.get("http://localhost:8081/employees"),
            axios.get("http://localhost:8081/ranks")])
            .then(axios.spread((firstResponse, secondResponse, thirdResponse) => {
                let departmentCode, tag = 0, dep, emp;
                let marking = this.props.match.params.marking;
                if (marking && /^[1-9]-[1-9][0-9]?$/i.test(marking)) {
                    [departmentCode, tag] = marking.split('-').map(Number);
                    dep = firstResponse.data.find(d => d.code === departmentCode);
                    emp = secondResponse.data.find(e => e.tag === tag && e.department === departmentCode)
                }
                this.setState({
                    departments: firstResponse.data,
                    department: (dep) ? { value: dep.code, label: dep.shortTitle } : null,
                    employees: secondResponse.data,
                    ranks: thirdResponse.data,
                    isLoading: false
                }, () => {
                    if (emp)
                        this.handleView(emp);
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

    loadQualification = async () => {
        await axios.get("http://localhost:8081/qualifications").then(res => {
            this.setState({
                qualifications: res.data
            });
        });
    }

    addEmployee = () => {
        let tmp = {
            regNum: this.state.selectedCitizens.value,
            rank: this.state.selectedRank.value,
            tag: this.state.tag,
            department: this.state.department.value
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
        this.setState({ selectedCitizens: null, selectedRank: null, tag: 0 });
    }

    handleView = (e) => {
        let c = this.props.citizens.find(c => c.regNum === e.person);
        let r = this.state.ranks.find(r => r.title === e.rank && r.department === e.department);
        this.setState({
            selectedCitizens: {
                value: c.regNum,
                label: c.regNum + " / " + c.name + " " + c.surname
            },
            selectedRank: {
                value: r.title,
                label: r.title
            },
            tag: e.tag
        })
    }

    optionsSearch = () => {
        return (v) => {
            return this.licenseIds.filter((e) => e.name.toLowerCase().startsWith(v.toLowerCase()));
        };
    }

    render() {

        let filteredRanks = [];
        let filteredEmployees = [];
        if (this.state.department) {
            filteredRanks = this.state.ranks.filter(r => r.department === this.state.department.value)
            filteredEmployees = this.state.employees.filter(e => e.department === this.state.department.value)
        }

        return (
            <div className="employees">
                <div className="block employee-list">
                    <div className="title title-select">
                        <h3>Employees</h3>
                        <div>
                            <Link
                                style={{ textDecoration: 'none' }}
                                to={"/employees"}>
                                <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                    options={this.state.departments.map(d => (
                                        {
                                            value: d.code,
                                            label: d.shortTitle
                                        })
                                    )}
                                    value={this.state.department}
                                    onChange={(e) => { this.setState({ department: e }); this.clearForm() }}
                                    placeholder="Department"
                                    noOptionsMessage={() => "Department not found"} />
                            </Link>
                        </div>
                    </div>
                    <div className="table-scroll">
                        {filteredEmployees.map((e, i) =>
                            <ul key={e.tag} className="employee-item">
                                <li>{this.state.department.value}-{e.tag}</li>
                                <li>{e.rank}</li>
                                <Link
                                    to={"/citizens/" + e.person}
                                    className="edit-button round-link">
                                    <li>{e.person}</li>
                                </Link>
                                <Link
                                    to={"/employees/" + this.state.department.value + "-" + e.tag}
                                    onClick={() => this.handleView(e)}
                                    className="edit-button round-link">
                                    <li>View</li>
                                </Link>
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
                                            value={this.state.selectedCitizens}
                                            onChange={(e) => this.setState({ selectedCitizens: e })}
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

                                    <div className="edit-list licenses">
                                        <p className="text-label">Qualifications: </p>
                                        <Link
                                            to={"/licenses"}
                                            className="round-link">
                                            AFT
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                        <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                            options={this.state.qualifications.map(l => (
                                                {
                                                    value: l.id,
                                                    label: l.name
                                                })
                                            )}
                                            onChange={(e) => { this.setState({ license: e.value }) }}
                                            placeholder="Qualification"
                                            noOptionsMessage={() => "Qualification not found"} />
                                        <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                    </div>

                                    <div className="edit-list related-incidents">
                                        <p className="text-label">Incidents: </p>
                                        <Link
                                            to={"/license?id=3"}
                                            className="round-link">
                                            #225
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    </div>
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