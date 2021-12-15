import React from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";
import moment from "moment";
import { Translation } from 'react-i18next';

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
            incidents: [],
            ranks: [],
            workHours: [],
            department: null,
            qualification: null,
            selectedRank: null,
            selectedCitizens: null,
            tag: 0,
            isLoading: true,
            selectedEmployeeId: 0
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
                let result = marking ? marking.match(new RegExp("^([1-9])[A-Z]{2}-([1-9][0-9]?)$")) : null;
                if (result) {
                    [departmentCode, tag] = [parseInt(result[1]), parseInt(result[2])];
                    dep = firstResponse.data.find(d => d.code === departmentCode);
                    emp = secondResponse.data.find(e => e.tag === tag && e.department === departmentCode);
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
        this.loadQualifications();
    }

    loadEmployees = async () => {
        await axios.get("http://localhost:8081/employees").then(res => {
            this.setState({
                employees: res.data
            })
        });
    }

    loadQualifications = async () => {
        await axios.get("http://localhost:8081/qualifications").then(res => {
            this.setState({
                qualifications: res.data
            });
        });
    }

    loadWorkHours = async () => {
        await axios.get("http://localhost:8081/work-hours/" + this.state.selectedEmployeeId).then(res => {
            this.setState({
                workHours: res.data
            })
        });
    }

    loadIncidents = async () => {
        await axios.get("http://localhost:8081/incident/officer/" + this.state.selectedEmployeeId).then(res => {
            this.setState({
                incidents: res.data
            })
        });
    }

    addEmployee = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    clearForm = () => {
        this.setState({ selectedCitizens: null, selectedRank: null, tag: 0, selectedEmployeeId: 0 });
        this.clearData();
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

    clearData = () => {
        this.setState({ qualification: null });
    }

    render() {
        let currTotal = 0, prevTotal = 0;
        this.state.workHours.forEach((w, i) => {
            if (moment(new Date(w.startTime)).isAfter(moment().subtract(7, 'days'))) 
                currTotal += Math.abs(new Date(w.endTime) - new Date(w.startTime)) / 36e5;
            else if (moment(new Date(w.startTime)).isBefore(moment().subtract(7, 'days')) && moment(new Date(w.startTime)).isAfter(moment().subtract(14, 'days')))
                prevTotal += Math.abs(new Date(w.endTime) - new Date(w.startTime)) / 36e5;
        })

        let filteredRanks = [];
        let filteredEmployees = [];
        if (this.state.department) {
            filteredRanks = this.state.ranks.filter(r => r.department === this.state.department.value)
            filteredEmployees = this.state.employees.filter(e => e.department === this.state.department.value)
        }

        let qualifications = (this.state.selectedEmployeeId) ? this.state.employees.filter(e => e.id === this.state.selectedEmployeeId)[0].qualifications : [];

        return (
            <div className="employees">
                <div className="block employee-list">
                    <div className="title title-select">
                        <Translation>
                            {
                                t => <h3>{t('Title Employees')}</h3>
                            }
                        </Translation>
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
                                    placeholder=
                                    {<Translation>
                                        {
                                            t => t('Department')
                                        }
                                    </Translation>}
                                    noOptionsMessage={() =>
                                        <Translation>
                                            {
                                                t => t('Not found')
                                            }
                                        </Translation>} />
                            </Link>
                        </div>
                    </div>
                    <div className="table-scroll">
                        {filteredEmployees.map((e, i) =>
                            <ul key={e.tag} className="employee-item">
                                <li>{e.marking}</li>
                                <li>{e.rank}</li>
                                <Link
                                    to={"/citizens/" + e.person}
                                    className="edit-button round-link">
                                    <li>{e.person}</li>
                                </Link>
                                <Link
                                    to={"/employees/" + e.marking}
                                    onClick={() => {
                                        this.handleView(e);
                                        this.clearData();
                                        this.setState({ selectedEmployeeId: e.id }, () => { this.loadWorkHours(); this.loadIncidents(); });
                                    }}
                                    className="edit-button round-link">
                                    <li>
                                        <Translation>
                                            {
                                                t => t('Button View')
                                            }
                                        </Translation>
                                    </li>
                                </Link>
                            </ul>
                        )}
                    </div>
                </div>
                <div className="block employee-editor">
                    <div className="title">
                        <h3>
                            <Translation>
                                {
                                    t =>
                                        <Link
                                            to={"/employees"}
                                            className="link"
                                            onClick={() => this.clearForm()}>
                                            {t('Title New')}
                                        </Link>
                                }
                            </Translation>
                        </h3>
                        <Translation>
                            {
                                t => <h3 onClick={() => { this.addEmployee() }}>{t('Title Send')}</h3>
                            }
                        </Translation>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={{ tag: this.state.tag }}
                            enableReinitialize={true}
                            validate={async values => {
                                const errors = {};

                                if (!this.state.selectedCitizens) {
                                    errors.selectedCitizens = 'Required';
                                }

                                if (!this.state.selectedRank) {
                                    errors.selectedRank = 'Required';
                                }

                                if (!values.tag) {
                                    errors.tag = 'Required';
                                } else if (parseInt(values.tag) < 0) {
                                    errors.tag = 'Must be positive';
                                }

                                return errors;
                            }}
                            onSubmit={async (values) => {
                                let tmp = {
                                    regNum: this.state.selectedCitizens.value,
                                    rank: this.state.selectedRank.value,
                                    tag: values.tag,
                                    department: this.state.department.value
                                };
                                await axios.post("http://localhost:8081/employee", tmp)
                                    .then(res => {
                                        if (!res.data.success)
                                            console.log(res.data.message);
                                        else
                                            this.loadEmployees();
                                    });
                            }}
                        >
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
                                            placeholder={
                                                <Translation>
                                                    {
                                                        t => t('Citizen')
                                                    }
                                                </Translation>
                                            }
                                            noOptionsMessage={() =>
                                                <Translation>
                                                    {
                                                        t => t('Not found')
                                                    }
                                                </Translation>} />
                                        <span className="floating-label active-label">
                                            <Translation>
                                                {
                                                    t => t('Citizen')
                                                }
                                            </Translation>
                                        </span>
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
                                            placeholder=
                                            {<Translation>
                                                {
                                                    t => t('Rank')
                                                }
                                            </Translation>}
                                            noOptionsMessage={() =>
                                                <Translation>
                                                    {
                                                        t => t('Not found')
                                                    }
                                                </Translation>} />
                                        <span className="floating-label active-label">
                                            <Translation>
                                                {
                                                    t => t('Rank')
                                                }
                                            </Translation>
                                        </span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" name="tag" onChange={(e) => this.setState({ tag: e.target.value })} />
                                        <ErrorMessage name="tag" className="error-label" component="div" />
                                        <span className="floating-label active-label">
                                            <Translation>
                                                {
                                                    t => t('Form Tag')
                                                }
                                            </Translation>
                                        </span>
                                    </div>
                                    <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>

                                    {this.state.selectedEmployeeId !== 0 &&
                                        <div className="edit-list licenses">
                                            <p className="text-label">
                                                <Translation>
                                                    {
                                                        t => t('Qualifications')
                                                    }
                                                </Translation>: </p>
                                            {qualifications.map(q =>
                                                <Link
                                                    key={q.id}
                                                    to={"/licenses"}
                                                    className="round-link">
                                                    {q.name}
                                                    <span className="link-button" onClick={async (e) => {
                                                        e.preventDefault();
                                                        await axios.delete("http://localhost:8081/employee/" + this.state.selectedEmployeeId + "/qualification/" + q.id + "/delete").then(_ => {
                                                            this.loadEmployees()
                                                            this.clearData();
                                                        });
                                                    }}>
                                                        <FontAwesomeIcon icon={faTimesCircle} />
                                                    </span>
                                                </Link>
                                            )}
                                            <div className="control">
                                                <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                                    options={this.state.qualifications.map(q => (
                                                        {
                                                            value: q.id,
                                                            label: q.name
                                                        })
                                                    )}
                                                    value={this.state.qualification}
                                                    onChange={(e) => { this.setState({ qualification: e }) }}
                                                    placeholder=
                                                    {<Translation>
                                                        {
                                                            t => t('Qualification')
                                                        }
                                                    </Translation>}
                                                    noOptionsMessage={() =>
                                                        <Translation>
                                                            {
                                                                t => t('Not found')
                                                            }
                                                        </Translation>} />
                                                <span className="link-button" onClick={async (e) => {
                                                    e.preventDefault();
                                                    let tmp = {
                                                        eid: this.state.selectedEmployeeId,
                                                        qid: this.state.qualification.value
                                                    };
                                                    if (!tmp.eid || !tmp.qid)
                                                        return;
                                                    await axios.post("http://localhost:8081/employee/" + tmp.eid + "/qualification/" + tmp.qid + "/add").then(_ => {
                                                        this.loadEmployees()
                                                        this.clearData();
                                                    });
                                                }}>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </span>
                                            </div>
                                        </div>
                                    }

                                    {this.state.selectedEmployeeId !== 0 &&
                                        <div className="edit-list related-incidents">
                                            <p className="text-label">
                                                <Translation>
                                                    {
                                                        t => t('Title Incidents')
                                                    }
                                                </Translation>: </p>
                                            {this.state.incidents.map(i =>
                                                <Link
                                                    key={i.id}
                                                    to={"/incidents/" + i.id}
                                                    className="round-link">
                                                    #{i.id}
                                                </Link>
                                            )}
                                        </div>
                                    }
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="block employee-work-hours">
                    <Translation>
                        {
                            t => <h3>{t('Title Work hours')}</h3>
                        }
                    </Translation>
                    <div className="table-scroll">
                        {(this.state.selectedEmployeeId) ?
                            <div>
                                <p className="text-label">
                                    Salary this week: {Math.round(currTotal * ((this.state.selectedEmployeeId) ? this.state.employees.filter(e => e.id === this.state.selectedEmployeeId)[0].salary : 0))}$
                                </p>
                                <p className="text-label">
                                    Salary previous week: {Math.round(prevTotal * ((this.state.selectedEmployeeId) ? this.state.employees.filter(e => e.id === this.state.selectedEmployeeId)[0].salary : 0))}$
                                </p>
                                <ul>
                                    {
                                        this.state.workHours.map((w, i) => {
                                            return <li key={i}>{"Session " + i + ": from - " + new Date(w.endTime).toLocaleString() + ", to - " + new Date(w.startTime).toLocaleString()}</li>;
                                        })
                                    }
                                </ul>
                            </div>
                            : ""
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Employees;