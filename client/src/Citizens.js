import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus, faSave, faChevronLeft, faChevronRight, faCopy, faDownload } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'
import SelectSearch from 'react-select-search';
import { DatePickerField } from "./DatePickerField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { customStyles } from "./Employees";

import "react-datepicker/dist/react-datepicker.css";

const CITIZENS_ON_PAGE = 3;

class Citizens extends React.Component {

    states = ["alive", "dead", "missing"];

    licenseIds = [
        { name: "1", value: 1 },
        { name: "2", value: 2 },
        { name: "3", value: 3 },
        { name: "4", value: 4 }
    ];
    propertyIds = [
        { name: "1", value: 1 },
        { name: "2", value: 2 },
        { name: "3", value: 3 },
        { name: "4", value: 4 }
    ];
    transportIds = [
        { name: "1", value: 1 },
        { name: "2", value: 2 },
        { name: "3", value: 3 },
        { name: "4", value: 4 }
    ];

    emptyCitizen = { regNum: "", name: "", surname: "", state: "", phoneNumber: "", birthdate: "" };

    constructor(props) {
        super(props);

        let selectedIdx = -1;
        if (this.props.match.params.regNum)
            selectedIdx = this.props.citizens.findIndex(e => e.regNum === this.props.match.params.regNum);

        this.state = {
            pageData: [],
            licenses: [],
            license: {},
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
            pageData: this.props.citizens.slice(this.state.offset, this.state.offset + CITIZENS_ON_PAGE),
            pageCount: Math.ceil(this.props.citizens.length / CITIZENS_ON_PAGE)
        });
    }

    loadLicenses = async () => {
        await axios.get("http://localhost:8081/licenses").then(res => {
            this.setState({
                licenses: res.data
            });
        });
    }

    componentDidMount = () => {
        this.loadCitizens();
        this.loadLicenses();
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
        await axios.post("http://localhost:8081/get_password_token", this.props.citizens[this.state.selectedIdx].regNum, { headers: { 'Content-Type': 'text/plain' } })
            .then((res) => {
                this.setState({ password: res.data });
            });
    }

    onCopy = () => {
        this.copyLabel.current.classList.add("copied");
        this.timeoutID = setTimeout(() => this.copyLabel.current.classList.remove("copied"), 3000);
    }

    render() {
        return (
            <div className="citizens">
                <div className="block citizen-list">
                    <h3>Citizens</h3>
                    <div className="table-scroll">
                        {this.state.pageData.map((o, i) =>
                            <ul className="citizen-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="regnum">{o.regNum}</li>
                                <li className="fullname">{o.name + " " + o.surname}</li>
                                <li className="phone">Phone: {o.phoneNumber}</li>
                                <Link
                                    to={"/citizens/" + (o.regNum)}
                                    className="edit-button round-link"
                                    onClick={() => this.setState({ selectedIdx: i + this.state.selectedPage * CITIZENS_ON_PAGE, password: "" })}>
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
                            <Link
                                to={"/citizens"}
                                className="link"
                                onClick={() => { this.setState({ selectedIdx: -1, password: "" }); }}>
                                New
                            </Link>
                        </h3>
                        <h3 onClick={() => { this.sendRegistration() }}>Send</h3>
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
                    <div className="table-scroll">
                        <div className="edit-list licenses">
                            <p className="text-label">Licenses: </p>
                            <Link
                                to={"/licenses"}
                                className="round-link">
                                #3
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                            <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                options={this.state.licenses.map(l => (
                                    {
                                        value: l.id,
                                        label: l.name
                                    })
                                )}
                                onChange={(e) => { this.setState({ license: e.value }) }}
                                placeholder="License"
                                noOptionsMessage={() => "License not found"} />
                            <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                <FontAwesomeIcon icon={faPlus} />
                            </span>
                        </div>

                        <div className="edit-list property">
                            <p className="text-label">Property: </p>
                            <Link
                                to={"/property?id=3"}
                                className="round-link">
                                #3
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                            <div className="report-controls">
                                <SelectSearch options={this.propertyIds} search filterOptions={this.optionsSearch} emptyMessage="Not found" placeholder="Property ID" />
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faSave} />
                                </span>
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </div>
                        </div>

                        <div className="edit-list transport">
                            <p className="text-label">Transport: </p>
                            <Link
                                to={"/transport?id=3"}
                                className="round-link">
                                #3
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                            <div className="report-controls">
                                <SelectSearch options={this.propertyIds} search filterOptions={this.optionsSearch} emptyMessage="Not found" placeholder="Transport ID" />
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faSave} />
                                </span>
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </div>
                        </div>

                        <div className="edit-list incidents">
                            <p className="text-label">Related incidents: </p>
                            <Link
                                to={"/incident?id=3"}
                                className="round-link">
                                #3
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                        </div>

                        <div className="edit-list criminal">
                            <p className="text-label">Criminal records: </p>
                            <Link
                                to={"/records?id=3"}
                                className="round-link">
                                #3
                                <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Citizens;