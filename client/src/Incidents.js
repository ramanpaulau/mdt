import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimesCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from 'react-select';
import axios from 'axios';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { customStyles } from "./Employees";
import { Translation } from 'react-i18next';

const INCIDENTS_ON_PAGE = 3;

class Incidents extends React.Component {

    emptyIncident = { id: -1, regNum: "", title: "", details: "", dateTime: "", location: "" };

    constructor(props) {
        super(props);

        this.state = {
            filter: '',
            filteredData: [],
            pageData: [],
            incidents: [],
            vehicles: [],
            boloCitizens: [],
            boloVehicles: [],
            activeOfficers: [],
            suspects: [],
            witnesses: [],
            indictments: [],
            datetime: new Date(),
            citizen: null,
            officer: null,
            suspect: null,
            witness: null,
            vehicle: null,
            employees: [],
            offset: 0,
            selectedIdx: -1,
            selectedPage: 0,
            pageCount: 0
        };

        this.sendButton = React.createRef();
    }

    getPageData = () => {
        this.setState({
            pageData: (this.state.filter) ? this.state.filteredData.slice(this.state.offset, this.state.offset + INCIDENTS_ON_PAGE) : this.state.incidents.slice(this.state.offset, this.state.offset + INCIDENTS_ON_PAGE),
            pageCount: (this.state.filter) ? Math.ceil(this.state.filteredData.length / INCIDENTS_ON_PAGE) : Math.ceil(this.state.incidents.length / INCIDENTS_ON_PAGE)
        });
    }

    componentDidMount = async () => {
        await axios.all([
            axios.get("http://localhost:8081/incidents"),
            axios.get("http://localhost:8081/vehicles"),
            axios.get("http://localhost:8081/employees")])
            .then(axios.spread((res1, res2, res3) => {
                let selectedIdx = -1;
                if (this.props.match.params.id)
                    selectedIdx = res1.data.findIndex(i => i.id === parseInt(this.props.match.params.id));
                this.setState({
                    incidents: res1.data,
                    vehicles: res2.data,
                    employees: res3.data,
                    selectedIdx: selectedIdx
                }, () => {
                    if (this.state.selectedIdx !== -1)
                        this.loadData();
                    this.getPageData();
                })
            }))
            .catch(error => console.log(error));
    }

    addBOLOCitizen = async () => {
        let tmp = {
            citizenRegNum: this.state.citizen.value,
            incidentId: this.state.incidents[this.state.selectedIdx].id
        }
        this.props.wsClient.publish({ destination: "/api/incident/bolo/persons", body: JSON.stringify(tmp) });
    }

    addBOLOVehicle = async () => {
        let tmp = {
            vehiclePlateNum: this.state.vehicle.value,
            incidentId: this.state.incidents[this.state.selectedIdx].id
        }
        this.props.wsClient.publish({ destination: "/api/incident/bolo/vehicles", body: JSON.stringify(tmp) });
    }

    addActiveOfficer = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.post("http://localhost:8081/incident/" + id + "/officer/" + this.state.officer.value + "/add").then(_ => this.loadOfficers());
    }

    addSuspect = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.post("http://localhost:8081/incident/" + id + "/suspect/" + this.state.suspect.value + "/add").then(_ => this.loadSuspects());
    }

    addWitness = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.post("http://localhost:8081/incident/" + id + "/witness/" + this.state.witness.value + "/add").then(_ => this.loadWitnesses());
    }

    loadSuspects = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.get("http://localhost:8081/incident/" + id + "/suspects").then(res => {
            this.setState({
                suspects: res.data
            });
        });
    }

    loadWitnesses = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.get("http://localhost:8081/incident/" + id + "/witnesses").then(res => {
            this.setState({
                witnesses: res.data
            });
        });
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * INCIDENTS_ON_PAGE);

        this.setState({ offset: offset, selectedPage: selected }, () => {
            this.getPageData();
        });
    };

    sendIncident = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    loadBoloCitizens = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.get("http://localhost:8081/incident/" + id + "/persons").then(res => {
            this.setState({
                boloCitizens: res.data
            });
        });
    }

    loadBoloVehicles = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.get("http://localhost:8081/incident/" + id + "/vehicles").then(res => {
            this.setState({
                boloVehicles: res.data
            });
        });
    }

    loadOfficers = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.get("http://localhost:8081/incident/" + id + "/officers").then(res => {
            this.setState({
                activeOfficers: res.data
            });
        });
    }

    loadIndictments = async () => {
        let id = this.state.incidents[this.state.selectedIdx].id;
        await axios.get("http://localhost:8081/incident/" + id + "/indictments").then(res => {
            this.setState({
                indictments: res.data.sort((a, b) => (a.id > b.id) ? 1 : (a.id === b.id) ? 0 : -1)
            });
        });
    }

    loadData = () => {
        this.loadBoloCitizens();
        this.loadBoloVehicles();
        this.loadOfficers();
        this.loadIndictments();
        this.loadSuspects();
        this.loadWitnesses();
    }

    clearForm = () => {
        this.setState({
            vehicle: null,
            citizen: null,
            officer: null,
            witness: null,
            suspect: null
        });
    }

    render() {
        return (
            <div className="incidents">
                <div className="block incident-list">
                    <Translation>
                        {
                            t => <h3>{t('Title Incidents')}</h3>
                        }
                    </Translation>
                    <div className="table-scroll">
                        <Translation>{t =>
                            <input placeholder={t('Input Filter')}
                                className="text-input"
                                type="text"
                                value={this.state.filter}
                                onChange={(e) => this.setState({ filter: e.target.value, filteredData: this.state.incidents.filter(i => (i.id + '').includes(e.target.value)) }, () => this.getPageData())} />
                        }</Translation>
                        {this.state.pageData.map((o, i) =>
                            <ul className="incident-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="id">#{o.id}</li>
                                <li className="name">{o.title}</li>
                                <li className="location">
                                    <Translation>
                                        {
                                            t => t('Location')
                                        }
                                    </Translation>: {o.location}</li>
                                <li className="superviser">
                                    <Translation>
                                        {
                                            t => t('Supervisor')
                                        }
                                    </Translation>
                                    :
                                    <Link
                                        style={{ marginLeft: "5px" }}
                                        to={"/employees/" + o.supervisor}
                                        className="round-link">
                                        {o.supervisor}
                                    </Link>
                                </li>
                                <li className="dateTime">
                                    <Translation>
                                        {
                                            t => t('Time')
                                        }
                                    </Translation>
                                    : {(new Date(o.dateTime)).toLocaleString()}</li>
                                <Link
                                    to={"/incidents/" + (o.id)}
                                    className="edit-button round-link"
                                    onClick={() => {
                                        this.setState({ selectedIdx: i + this.state.selectedPage * INCIDENTS_ON_PAGE }, () => { this.loadData(); this.clearForm(); });
                                    }}>
                                    <Translation>
                                        {
                                            t => t('Button View')
                                        }
                                    </Translation>
                                </Link>
                            </ul>
                        )}
                    </div>
                    <ReactPaginate
                        previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                        nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                        breakLabel="..."
                        breakClassName="break-me"
                        pageCount={Math.ceil(this.state.pageCount)}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        onPageChange={this.handlePageClick}
                        containerClassName="pagination"
                        pageClassName="pag-link"
                        activeLinkClassName="pag-active"
                        previousLinkClassName="pag-previous"
                        nextLinkClassName="pag-next"
                        hrefAllControls
                    />
                </div>
                <div className="block incident-editor">
                    <div className="title">
                        <h3>
                            <Translation>
                                {
                                    t =>
                                        <Link
                                            to={"/incidents"}
                                            className="link"
                                            onClick={() => { this.setState({ selectedIdx: -1 }); }}>
                                            {t('Title New')}
                                        </Link>
                                }
                            </Translation>
                        </h3>
                        <Translation>
                            {
                                t => <h3 onClick={() => { this.sendIncident() }}>{t('Title Send')}</h3>
                            }
                        </Translation>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={(this.state.selectedIdx === -1) ? this.emptyIncident : this.state.incidents[this.state.selectedIdx]}
                            enableReinitialize={true}
                            validate={async values => {
                                const errors = {};

                                if (!values.title) {
                                    errors.title = 'Required';
                                }

                                if (!values.location) {
                                    errors.location = 'Required';
                                }

                                if (!values.details) {
                                    errors.details = 'Required';
                                }

                                return errors;
                            }}

                            onSubmit={async (values) => {
                                let tmp = {
                                    id: (this.state.selectedIdx === -1) ? 0 : this.state.incidents[this.state.selectedIdx].id,
                                    supervisor: this.props.store.employeeId,
                                    title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
                                    location: values.location,
                                    datetime: this.state.datetime.toLocaleString(),
                                    details: values.details
                                };

                                await axios.post("http://localhost:8081/incident", tmp).then(async res => {
                                    if (!res.data.success)
                                        console.log(res.data.message);
                                    else {
                                        await axios.get("http://localhost:8081/incidents").then(res => {
                                            this.setState({ incidents: res.data });
                                            this.getPageData();
                                        });
                                    }
                                });
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div>
                                        {(this.state.selectedIdx === -1) ? "" : <p className="incident-id">#{this.state.incidents[this.state.selectedIdx].id}</p>}
                                    </div>
                                    <div>
                                        <Field className="text-input" type="text" style={{ textTransform: "capitalize" }} name="title" />
                                        <ErrorMessage name="title" className="error-label" component="div" />
                                        <span className="floating-label">
                                            <Translation>
                                                {
                                                    t => t('Form Title')
                                                }
                                            </Translation>
                                        </span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="text" style={{ textTransform: "uppercase" }} name="location" />
                                        <ErrorMessage name="location" className="error-label" component="div" />
                                        <span className="floating-label">
                                            <Translation>
                                                {
                                                    t => t('Form Location')
                                                }
                                            </Translation>
                                        </span>
                                    </div>
                                    <div className="textarea">
                                        <Field className="text-input" type="text" as="textarea" name="details" />
                                        <ErrorMessage name="details" className="error-label" component="div" />
                                        <span className="floating-label">
                                            <Translation>
                                                {
                                                    t => t('Form Description')
                                                }
                                            </Translation>
                                        </span>
                                    </div>
                                    <div className="datetime">
                                        <Datetime inputProps={{ disabled: (this.state.selectedIdx !== -1) }} value={this.state.datetime} onChange={(e) => { this.setState({ datetime: e }) }} />
                                        <span className="floating-label active-label">
                                            <Translation>
                                                {
                                                    t => t('Time')
                                                }
                                            </Translation>
                                        </span>
                                    </div>
                                    <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="block incident-info">
                    <div className="title">
                        <Translation>
                            {
                                t => <h3 style={{ borderRight: "none" }}>{t('Title Incident info')}</h3>
                            }
                        </Translation>
                    </div>
                    <div className="table-scroll">
                        {(this.state.selectedIdx === -1) ? "" :
                            <div>
                                <div className="edit-list bolo-vehicle">
                                    <p className="text-label">
                                        <Translation>
                                            {
                                                t => t('Title BOLO Vehicles')
                                            }
                                        </Translation>
                                        : </p>
                                    {this.state.boloVehicles.map(v =>
                                        <Link key={v.vin}
                                            to={"/vehicles/" + v.plateNum}
                                            className="round-link">
                                            {v.plateNum + " / " + v.name}
                                            <span className="link-button" onClick={(e) => {
                                                e.preventDefault();
                                                let tmp = {
                                                    vehiclePlateNum: v.plateNum,
                                                    incidentId: this.state.incidents[this.state.selectedIdx].id
                                                }
                                                this.props.wsClient.publish({ destination: "/api/incident/bolo/vehicles/delete", body: JSON.stringify(tmp) });
                                            }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={this.state.vehicles.map(l => (
                                            {
                                                value: l.plateNum,
                                                label: l.plateNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ vehicle: e }) }}
                                        value={this.state.vehicle}
                                        placeholder={<Translation>
                                            {
                                                t => t('Title Vehicles')
                                            }
                                        </Translation>}
                                        noOptionsMessage={() => <Translation>
                                            {
                                                t => t('Not found')
                                            }
                                        </Translation>} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.addBOLOVehicle(); this.setState({ vehicle: null }); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list bolo-citizen">
                                    <p className="text-label">
                                        <Translation>
                                            {
                                                t => t('Title BOLO Citizens')
                                            }
                                        </Translation>: </p>
                                    {this.state.boloCitizens.map(c =>
                                        <Link key={c.regNum}
                                            to={"/citizens/" + c.regNum}
                                            className="round-link">
                                            {c.regNum + " / " + c.name}
                                            <span className="link-button" onClick={(e) => {
                                                e.preventDefault();
                                                let tmp = {
                                                    citizenRegNum: c.regNum,
                                                    incidentId: this.state.incidents[this.state.selectedIdx].id
                                                }
                                                this.props.wsClient.publish({ destination: "/api/incident/bolo/persons/delete", body: JSON.stringify(tmp) });
                                            }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided, width: "224px" }) }}
                                        options={this.props.citizens.map(c => (
                                            {
                                                value: c.regNum,
                                                label: c.regNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ citizen: e }) }}
                                        value={this.state.citizen}
                                        placeholder={<Translation>
                                            {
                                                t => t('Title Citizens')
                                            }
                                        </Translation>}
                                        noOptionsMessage={() => <Translation>
                                            {
                                                t => t('Not found')
                                            }
                                        </Translation>} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.addBOLOCitizen(); this.setState({ citizen: null }); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list active-officers">
                                    <p className="text-label">
                                        <Translation>
                                            {
                                                t => t('Officers')
                                            }
                                        </Translation>
                                        : </p>
                                    {this.state.activeOfficers.map(o =>
                                        <Link key={o.id}
                                            to={"/employees/" + o.marking}
                                            className="round-link">
                                            {o.marking}
                                            <span className="link-button" onClick={async (e) => {
                                                e.preventDefault();
                                                await axios.delete("http://localhost:8081/incident/" + this.state.incidents[this.state.selectedIdx].id + "/officer/" + o.id + "/delete").then(_ => this.loadOfficers());
                                                this.setState({ officer: null });
                                            }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={this.state.employees.map(e => (
                                            {
                                                value: e.id,
                                                label: e.marking
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ officer: e }) }}
                                        value={this.state.officer}
                                        placeholder={<Translation>
                                            {
                                                t => t('Officers')
                                            }
                                        </Translation>}
                                        noOptionsMessage={() => <Translation>
                                            {
                                                t => t('Not found')
                                            }
                                        </Translation>} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.addActiveOfficer(); this.setState({ officer: null }); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list indictment-list">
                                    <p className="text-label">
                                        <Translation>
                                            {
                                                t => t('Title Indictments')
                                            }
                                        </Translation>: </p>
                                    {this.state.indictments.map(i =>
                                        <Link key={i.id}
                                            to={"/indictments/" + i.id}
                                            className="round-link">
                                            #{i.id}
                                        </Link>
                                    )}
                                </div>

                                <div className="edit-list witnesses">
                                    <p className="text-label">
                                        <Translation>
                                            {
                                                t => t('Witnesses')
                                            }
                                        </Translation>: </p>
                                    {this.state.witnesses.map(c =>
                                        <Link key={c.regNum}
                                            to={"/citizens/" + c.regNum}
                                            className="round-link">
                                            {c.regNum + " / " + c.name}
                                            <span className="link-button" onClick={async (e) => {
                                                e.preventDefault();
                                                await axios.delete("http://localhost:8081/incident/" + this.state.incidents[this.state.selectedIdx].id + "/witness/" + c.regNum + "/delete").then(_ => this.loadWitnesses());
                                                this.setState({ witness: null });
                                            }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={this.props.citizens.map(c => (
                                            {
                                                value: c.regNum,
                                                label: c.regNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ witness: e }) }}
                                        value={this.state.witness}
                                        placeholder=
                                        {<Translation>
                                            {
                                                t => t('Witnesses')
                                            }
                                        </Translation>}
                                        noOptionsMessage={() => <Translation>
                                            {
                                                t => t('Not found')
                                            }
                                        </Translation>} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.addWitness(); this.setState({ witness: null }); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list suspect">
                                    <p className="text-label">
                                        <Translation>
                                            {
                                                t => t('Suspects')
                                            }
                                        </Translation>: </p>
                                    {this.state.suspects.map(c =>
                                        <Link key={c.regNum}
                                            to={"/citizens/" + c.regNum}
                                            className="round-link">
                                            {c.regNum + " / " + c.name}
                                            <span className="link-button" onClick={async (e) => {
                                                e.preventDefault();
                                                await axios.delete("http://localhost:8081/incident/" + this.state.incidents[this.state.selectedIdx].id + "/suspect/" + c.regNum + "/delete").then(_ => this.loadSuspects());
                                                this.setState({ suspect: null });
                                            }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={this.props.citizens.map(c => (
                                            {
                                                value: c.regNum,
                                                label: c.regNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ suspect: e }) }}
                                        value={this.state.suspect}
                                        placeholder=
                                        {<Translation>
                                            {
                                                t => t('Suspects')
                                            }
                                        </Translation>}
                                        noOptionsMessage={() => <Translation>
                                            {
                                                t => t('Not found')
                                            }
                                        </Translation>} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.addSuspect(); this.setState({ suspect: null }); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        );
    }
}

export default Incidents;