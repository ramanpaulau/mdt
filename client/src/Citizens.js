import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus, faChevronLeft, faChevronRight, faCopy, faDownload } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'
import { DatePickerField } from "./DatePickerField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { customStyles } from "./Employees";
import { Translation } from 'react-i18next';

import "react-datepicker/dist/react-datepicker.css";

const CITIZENS_ON_PAGE = 6;

class Citizens extends React.Component {

    states = ["alive", "dead", "missing"];

    emptyCitizen = { regNum: "", name: "", surname: "", state: "", phoneNumber: "", birthdate: "" };

    constructor(props) {
        super(props);

        let selectedIdx = -1;
        if (this.props.match.params.regNum)
            selectedIdx = this.props.citizens.findIndex(e => e.regNum === this.props.match.params.regNum);

        this.state = {
            filter: '',
            filteredData: [],
            pageData: [],
            licenses: [],
            vehicles: [],
            citizenVehicles: [],
            citizenFines: [],
            citizenIndictments: [],
            citizenRecords: [],
            license: null,
            vehicle: null,
            offset: 0,
            selectedIdx: selectedIdx,
            selectedPage: 0,
            pageCount: 0,
            password: ""
        };

        this.copyLabel = React.createRef();
        this.sendButton = React.createRef();
    }

    loadCitizens = () => {
        this.setState({
            pageData: (this.state.filter) ? this.state.filteredData.slice(this.state.offset, this.state.offset + CITIZENS_ON_PAGE) : this.props.citizens.slice(this.state.offset, this.state.offset + CITIZENS_ON_PAGE),
            pageCount: (this.state.filter) ? Math.ceil(this.state.filteredData.length / CITIZENS_ON_PAGE) : Math.ceil(this.props.citizens.length / CITIZENS_ON_PAGE)
        });
    }

    loadLicenses = async () => {
        await axios.get("http://localhost:8081/licenses").then(res => {
            this.setState({
                licenses: res.data
            });
        });
    }

    loadVehicles = async () => {
        await axios.get("http://localhost:8081/vehicles/free").then(res => {
            this.setState({
                vehicles: res.data
            });
        });
    }

    componentDidMount = () => {
        this.loadCitizens();
        this.loadLicenses();
        this.loadVehicles();

        if (this.props.match.params.regNum)
            this.loadData();
    }

    componentWillUnmount = () => {
        clearTimeout(this.timeoutID);
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * CITIZENS_ON_PAGE);

        this.setState({ offset: offset, selectedPage: selected }, () => {
            this.loadCitizens();
        });
    };

    removeLicense = (id) => {
        alert(id);
    }

    optionsSearch = () => {
        return (v) => {
            return this.licenseIds.filter((e) => e.name.toLowerCase().startsWith(v.toLowerCase()));
        };
    }

    sendRegistration = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    getPassword = async () => {
        if (this.state.selectedIdx === -1)
            return;
        let tmp = {
            customer: this.props.store.regNum,
            target: this.props.citizens[this.state.selectedIdx].regNum
        }
        await axios.post("http://localhost:8081/get_password_token", tmp)
            .then((res) => {
                if (res.data.success)
                    this.setState({ password: res.data.message });
                else
                    console.log(res.data.message);
            });
    }

    onCopy = () => {
        this.copyLabel.current.classList.add("copied");
        this.timeoutID = setTimeout(() => this.copyLabel.current.classList.remove("copied"), 3000);
    }

    getCitizenFines = async () => {
        await axios.get("http://localhost:8081/person/" + this.props.citizens[this.state.selectedIdx].regNum + "/fines").then(res => {
            this.setState({ citizenFines: res.data });
        });
    }

    getCitizenVehicles = async () => {
        await axios.get("http://localhost:8081/person/" + this.props.citizens[this.state.selectedIdx].regNum + "/vehicles").then(res => {
            this.setState({ citizenVehicles: res.data });
        });
    }

    getCitizenIndictments = async () => {
        await axios.get("http://localhost:8081/indictments/person/" + this.props.citizens[this.state.selectedIdx].regNum).then(res => {
            this.setState({ citizenIndictments: res.data });
        });
    }

    getCitizenRecords = async () => {
        await axios.get("http://localhost:8081/incidents/person/" + this.props.citizens[this.state.selectedIdx].regNum).then(res => {
            this.setState({ citizenRecords: res.data });
        });
    }

    registerVehicle = async () => {
        if (!this.state.vehicle)
            return;
        let tmp = {
            regNum: this.props.citizens[this.state.selectedIdx].regNum,
            plateNum: this.state.vehicle.value
        }
        await axios.post("http://localhost:8081/person/vehicle", tmp).then(res => {
            if (!res.data.success)
                console.log(res.data.message);
            this.getCitizenVehicles();
            this.loadVehicles();
        });
        this.setState({ vehicle: null });
    }

    clearForm = () => {
        this.setState({ vehicle: null, license: null });
    }

    loadData = () => {
        this.getCitizenVehicles(); 
        this.getCitizenFines(); 
        this.getCitizenIndictments(); 
        this.getCitizenRecords();
    }

    render() {
        return (
            <div className="citizens">
                <div className="block citizen-list">
                    <Translation>
                        {
                            t => <h3>{t('Title Citizens')}</h3>
                        }
                    </Translation>
                    <div className="table-scroll">
                        <input placeholder="Filter" className="text-input" type="text" value={this.state.filter} onChange={(e) => this.setState({ filter: e.target.value, filteredData: this.props.citizens.filter(c => c.regNum.toLowerCase().includes(e.target.value.toLowerCase()) || (c.name.toLowerCase() + ' ' + c.surname.toLowerCase()).includes(e.target.value.toLowerCase())) }, () => this.loadCitizens())} />
                        {this.state.pageData.map((o, i) =>
                            <ul className="citizen-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="regnum">{o.regNum}</li>
                                <li className="fullname">{o.name + " " + o.surname}</li>
                                <li className="phone">Phone: {o.phoneNumber}</li>
                                <Link
                                    to={"/citizens/" + (o.regNum)}
                                    className="edit-button round-link"
                                    onClick={() => {
                                        this.setState({ selectedIdx: i + this.state.selectedPage * CITIZENS_ON_PAGE, password: "" }, () => { this.loadData(); this.clearForm(); });
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
                <div className="block citizen-editor">
                    <div className="title">
                        <h3>
                            <Translation>
                                {
                                    t =>
                                        <Link
                                            to={"/citizens"}
                                            className="link"
                                            onClick={() => { this.setState({ selectedIdx: -1, password: "" }); }}>
                                            {t('Title New')}
                                        </Link>
                                }
                            </Translation>
                        </h3>
                        <Translation>
                            {
                                t => <h3 onClick={() => { this.sendRegistration() }}>{t('Title Send')}</h3>
                            }
                        </Translation>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={(this.state.selectedIdx === -1) ? this.emptyCitizen : this.props.citizens[this.state.selectedIdx]}
                            enableReinitialize={true}
                            validate={async values => {
                                const errors = {};
                                if (!values.name) {
                                    errors.name = 'Required';
                                } else if (!/^[A-Za-z ]{2,}$/i.test(values.name)) {
                                    errors.name = 'Invalid name';
                                }

                                if (!values.surname) {
                                    errors.surname = 'Required';
                                } else if (!/^[A-Za-z ]{2,}$/i.test(values.surname)) {
                                    errors.surname = 'Invalid surname';
                                }

                                if (!values.phoneNumber) {
                                    errors.phoneNumber = 'Required';
                                } else if (!/^\d{3}-\d{4}$/i.test(values.phoneNumber)) {
                                    errors.phoneNumber = 'Invalid phone number';
                                }

                                if (!values.regNum) {
                                    errors.regNum = 'Required';
                                } else if (!/^[A-Z0-9]{4}$/i.test(values.regNum)) {
                                    errors.regNum = 'Invalid registration number';
                                } else {
                                    await axios.get("http://localhost:8081/is_regNum_available/" + values.regNum.toUpperCase()).then((res) => {
                                        if (!res.data)
                                            errors.regNum = 'Occupied';
                                    });
                                }

                                if (!values.birthdate) {
                                    errors.birthdate = 'Required';
                                }

                                return errors;
                            }}
                            onSubmit={(values) => {
                                let tmp = {
                                    regNum: values.regNum.toUpperCase(),
                                    name: values.name.charAt(0).toUpperCase() + values.name.slice(1),
                                    surname: values.surname.charAt(0).toUpperCase() + values.surname.slice(1),
                                    birthdate: new Date(values.birthdate),
                                    phoneNumber: values.phoneNumber,
                                    state: 1
                                };
                                this.props.wsClient.publish({ destination: "/api/persons", body: JSON.stringify(tmp) });
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div>
                                        <Field className="text-input" type="text" style={{ textTransform: "capitalize" }} name="name" />
                                        <ErrorMessage name="name" className="error-label" component="div" />
                                        <span className="floating-label">Name</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="text" style={{ textTransform: "capitalize" }} name="surname" />
                                        <ErrorMessage name="surname" className="error-label" component="div" />
                                        <span className="floating-label">Surname</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="text" name="phoneNumber" />
                                        <ErrorMessage name="phoneNumber" className="error-label" component="div" />
                                        <span className="floating-label">Phone</span>
                                    </div>
                                    <div>
                                        <DatePickerField className="datePicker" name="birthdate" />
                                        <ErrorMessage name="birthdate" className="error-label" component="div" />
                                        <span className="floating-label active-label">Birth date</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="text" style={{ textTransform: "uppercase" }} name="regNum" />
                                        <ErrorMessage name="regNum" className="error-label" component="div" />
                                        <span className="floating-label">Registration number</span>
                                    </div>
                                    <div className="password-link">
                                        <input disabled type="text" className="text-input" value={this.state.password} />
                                        <span className="floating-label active-label">Get password link</span>
                                        <span onClick={this.getPassword} className="get-label"><FontAwesomeIcon icon={faDownload} /></span>
                                        <CopyToClipboard text={this.state.password} onCopy={this.onCopy}>
                                            <span className="copy-label" ref={this.copyLabel}><FontAwesomeIcon icon={faCopy} /></span>
                                        </CopyToClipboard>
                                    </div>
                                    <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="block citizen-info">
                    <div className="title">
                        <Translation>
                            {
                                t => <h3 style={{ borderRight: "none" }}>{t('Title Citizens info')}</h3>
                            }
                        </Translation>
                    </div>
                    {(this.state.selectedIdx === -1) ? "" :
                        <div className="table-scroll">
                            <div className="edit-list licenses">
                                <p className="text-label">Licenses: </p>
                                {this.props.citizens[this.state.selectedIdx].licenses.map((l, i) =>
                                    <Link
                                        key={i}
                                        className="round-link"
                                        to={"/licenses"}>
                                        {l.name}
                                        <span className="link-button" onClick={(e) => {
                                            e.preventDefault();
                                            let tmp = {
                                                regNum: this.props.citizens[this.state.selectedIdx].regNum,
                                                lid: l.id
                                            };
                                            if (!tmp.lid || !tmp.lid)
                                                return;
                                            this.props.wsClient.publish({ destination: "/api/person/license/delete", body: JSON.stringify(tmp) });
                                            this.setState({ license: null });
                                        }}>
                                            <FontAwesomeIcon icon={faTimesCircle} />
                                        </span>
                                    </Link>
                                )}
                                <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                    options={this.state.licenses.map(l => (
                                        {
                                            value: l.id,
                                            label: l.name
                                        })
                                    )}
                                    onChange={(e) => { this.setState({ license: e }) }}
                                    value={this.state.license}
                                    placeholder="License"
                                    noOptionsMessage={() => "Not found"} />
                                <span className="link-button" onClick={(e) => {
                                    e.preventDefault();
                                    let tmp = {
                                        regNum: this.props.citizens[this.state.selectedIdx].regNum,
                                        lid: this.state.license.value
                                    };
                                    if (!tmp.regNum || !tmp.lid)
                                        return;
                                    this.props.wsClient.publish({ destination: "/api/person/license/add", body: JSON.stringify(tmp) });
                                    this.setState({ license: null });
                                }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </div>
                            <div className="edit-list transport">
                                <p className="text-label">Vehicles: </p>
                                {this.state.citizenVehicles.map(v =>
                                    <Link key={v.vin}
                                        to={"/vehicles/" + v.plateNum}
                                        className="round-link">
                                        {v.plateNum + " / " + v.name}
                                        <span className="link-button" onClick={async (e) => {
                                            e.preventDefault();
                                            await axios.delete("http://localhost:8081/person/" + this.props.citizens[this.state.selectedIdx].regNum + "/vehicle/" + v.vin).then(_ => {
                                                this.getCitizenVehicles();
                                                this.loadVehicles();
                                                this.setState({ vehicle: null });
                                            });
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
                                    placeholder="Vehicles"
                                    noOptionsMessage={() => "Not found"} />
                                <span className="link-button" onClick={(e) => { e.preventDefault(); this.registerVehicle(); }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </div>

                            <div className="edit-list">
                                <p className="text-label">Fines: </p>
                                {this.state.citizenFines.map(f =>
                                    (f.state) ? "" :
                                        <Link key={f.id}
                                            to={"/fines/" + f.person}
                                            className="round-link">
                                            {f.amount}$
                                        </Link>
                                )}
                            </div>

                            <div className="edit-list related-incidents">
                                <p className="text-label">Related incidents: </p>
                                {this.state.citizenRecords.map(i =>
                                    <Link key={i}
                                        to={"/incidents/" + i}
                                        className="round-link">
                                        #{i}
                                    </Link>
                                )}
                            </div>

                            <div className="edit-list criminal">
                                <p className="text-label">Criminal records: </p>
                                {this.state.citizenIndictments.map(i =>
                                    <Link key={i.id}
                                        to={"/indictments/" + i.id}
                                        className="round-link">
                                        #{i.id}
                                    </Link>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div >
        );
    }
}

export default Citizens;