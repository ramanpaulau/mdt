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
            datetime: new Date(),
            citizen: undefined,
            plateNum: undefined,
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

    loadIncidents = async () => {
        await axios.get("http://localhost:8081/incidents").then(res => {
            this.setState({
                incidents: res.data
            }, () => { this.getPageData() });
        });
    }

    loadVehicles = async () => {
        await axios.get("http://localhost:8081/vehicles").then(res => {
            this.setState({
                vehicles: res.data
            });
        });
    }

    componentDidMount = () => {
        this.loadIncidents();
        this.loadVehicles();
    }

    registerBOLOCitizen = async () => {
        let tmp = {
            citizenRegNum: this.state.citizen,
            incidentId: this.state.incidents[this.state.selectedIdx].id
        }
        this.props.wsClient.publish({ destination: "/api/incident/bolo/persons", body: JSON.stringify(tmp) });
    }

    registerBOLOVehicle = async () => {
        let tmp = {
            vehiclePlateNum: this.state.plateNum,
            incidentId: this.state.incidents[this.state.selectedIdx].id
        }
        this.props.wsClient.publish({ destination: "/api/incident/bolo/vehicles", body: JSON.stringify(tmp) });
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * INCIDENTS_ON_PAGE);

        this.setState({ offset: offset, selectedPage: selected }, () => {
            this.loadCitizens();
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
                        <input placeholder="Filter" className="text-input" type="text" value={this.state.filter} onChange={(e) => this.setState({ filter: e.target.value, filteredData: this.state.incidents.filter(i => (i.id + '').includes(e.target.value)) }, () => this.getPageData())} />
                        {this.state.pageData.map((o, i) =>
                            <ul className="incident-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="id">#{o.id}</li>
                                <li className="name">{o.title}</li>
                                <li className="location">Location: {o.location}</li>
                                <li className="superviser">Supervisor: {o.supervisor}</li>
                                <li className="dateTime">Date: {(new Date(o.dateTime)).toLocaleString()}</li>
                                <Link
                                    to={"/incidents/" + (o.id)}
                                    className="edit-button round-link"
                                    onClick={() => {
                                        this.setState({ selectedIdx: i + this.state.selectedPage * INCIDENTS_ON_PAGE }, () => { this.loadBoloCitizens(); this.loadBoloVehicles(); });
                                    }}>
                                    View
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

                                return errors;
                            }}
                            onSubmit={async (values) => {
                                let tmp = {
                                    supervisor: this.props.store.employeeId,
                                    title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
                                    location: values.location,
                                    datetime: this.state.datetime.toLocaleString(),
                                    details: values.details
                                };
                                await axios.post("http://localhost:8081/incident", tmp).then(res => {
                                    if (!res.data.success)
                                        console.log(res.data.message);
                                    else {
                                        this.setState({ incidents: [...this.state.incidents, tmp] }, () => { this.getPageData() });
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
                                        <span className="floating-label">Title</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="text" style={{ textTransform: "uppercase" }} name="location" />
                                        <ErrorMessage name="location" className="error-label" component="div" />
                                        <span className="floating-label">Location</span>
                                    </div>
                                    <div className="textarea">
                                        <Field className="text-input" type="text" as="textarea" name="details" />
                                        <ErrorMessage name="details" className="error-label" component="div" />
                                        <span className="floating-label">Details</span>
                                    </div>
                                    <div className="datetime">
                                        <Datetime value={this.state.datetime} onChange={(e) => { this.setState({ datetime: e }) }} />
                                        <span className="floating-label active-label">Date & Time</span>
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
                                    <p className="text-label">BOLO Vehicles: </p>
                                    {this.state.boloVehicles.map(v =>
                                        <Link key={v.vin}
                                            to={"/vehicles/" + v.plateNum}
                                            className="round-link">
                                            {v.plateNum + " / " + v.name}
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
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
                                        onChange={(e) => { this.setState({ plateNum: e.value }) }}
                                        placeholder="Vehicles"
                                        noOptionsMessage={() => "Not found"} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.registerBOLOVehicle(); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list bolo-citizen">
                                    <p className="text-label">BOLO Citizen: </p>
                                    {this.state.boloCitizens.map(c =>
                                        <Link key={c.regNum}
                                            to={"/citizens/" + c.regNum}
                                            className="round-link">
                                            {c.regNum + " / " + c.name}
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
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
                                        onChange={(e) => { this.setState({ citizen: e.value }) }}
                                        placeholder="Citizen"
                                        noOptionsMessage={() => "Not found"} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.registerBOLOCitizen(); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list supervisor">
                                    <p className="text-label">Supervisor: </p>
                                    {[].map(v =>
                                        <Link key={v.vin}
                                            to={"/employees/" + v.plateNum}
                                            className="round-link">
                                            {v.plateNum + " / " + v.name}
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={[].map(l => (
                                            {
                                                value: l.plateNum,
                                                label: l.plateNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ plateNum: e.value }) }}
                                        placeholder="Employees"
                                        noOptionsMessage={() => "Not found"} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.registerBOLOCitizen(); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list active-officers">
                                    <p className="text-label">Active officers: </p>
                                    {[].map(v =>
                                        <Link key={v.vin}
                                            to={"/employees/" + v.plateNum}
                                            className="round-link">
                                            {v.plateNum + " / " + v.name}
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={[].map(l => (
                                            {
                                                value: l.plateNum,
                                                label: l.plateNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ plateNum: e.value }) }}
                                        placeholder="Employees"
                                        noOptionsMessage={() => "Not found"} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.registerBOLOCitizen(); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list indictment-list">
                                    <p className="text-label">Indictments: </p>
                                    {[].map(v =>
                                        <Link key={v.vin}
                                            to={"/indictments/" + v.plateNum}
                                            className="round-link">
                                            {v.plateNum + " / " + v.name}
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={[].map(l => (
                                            {
                                                value: l.plateNum,
                                                label: l.plateNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ plateNum: e.value }) }}
                                        placeholder="Indictments"
                                        noOptionsMessage={() => "Not found"} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.registerBOLOCitizen(); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list witnesses">
                                    <p className="text-label">Witnesses: </p>
                                    {[].map(v =>
                                        <Link key={v.vin}
                                            to={"/citizen/" + v.plateNum}
                                            className="round-link">
                                            {v.plateNum + " / " + v.name}
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={[].map(l => (
                                            {
                                                value: l.plateNum,
                                                label: l.plateNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ plateNum: e.value }) }}
                                        placeholder="Witnesses"
                                        noOptionsMessage={() => "Not found"} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.registerBOLOCitizen(); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>

                                <div className="edit-list suspect">
                                    <p className="text-label">Suspect: </p>
                                    {[].map(v =>
                                        <Link key={v.vin}
                                            to={"/citizen/" + v.plateNum}
                                            className="round-link">
                                            {v.plateNum + " / " + v.name}
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </Link>
                                    )}
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                        options={[].map(l => (
                                            {
                                                value: l.plateNum,
                                                label: l.plateNum
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ plateNum: e.value }) }}
                                        placeholder="Suspect"
                                        noOptionsMessage={() => "Not found"} />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.registerBOLOCitizen(); }}>
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