import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faSave, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { observer } from "mobx-react";
import Select from 'react-select';
import { customStyles } from "./Employees";
import { Translation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

const CALLS_ON_PAGE = 20;

class Calls extends React.Component {
    emptyCall = { id: "", time: "", location: "", phone: "", text: "", officers: "" };

    constructor(props) {
        super(props);

        let id = this.props.match.params.id;

        if (id === undefined)
            id = 0;

        let selectedIdx = -1;
        if (this.props.match.params.id)
            selectedIdx = this.props.calls.findIndex(c => c.id === parseInt(this.props.match.params.id));

        this.state = {
            pageData: [],
            reports: [],
            report: 0,
            offset: 0,
            selectedIdx: selectedIdx,
            selectedPage: 0,
            pageCount: 0
        };

        this.sendButton = React.createRef();
    }

    loadCalls = () => {
        this.setState({
            pageData: this.props.calls.slice(this.state.offset, this.state.offset + CALLS_ON_PAGE),
            pageCount: Math.ceil(this.props.calls.length / CALLS_ON_PAGE)
        });
    }
    loadReports = async () => {
        await axios.get("http://localhost:8081/incidents").then(res => {
            this.setState({ reports: res.data.map(r => r.id) });
        });
    }

    componentDidMount = () => {
        this.loadCalls();
        this.loadReports();
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * CALLS_ON_PAGE);

        this.setState({ offset: offset, selected: selected }, () => {
            this.loadCalls();
        });
    };

    sendCall = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    handleTextarea = (event) => {
        let tmp = this.state.selectedCall;
        tmp.text = event.target.value;
        this.setState({ selectCall: tmp });
    }

    optionsSearch = () => {
        return (v) => {
            return this.state.reports.filter((e) => e.name.toLowerCase().startsWith(v.toLowerCase()));
        };
    }

    render() {
        let incidentId = (this.state.selectedIdx === -1) ? 0 : this.props.calls[this.state.selectedIdx].incidentId;
        return (
            <div className="calls">
                {((this.props.store.employeeId) || (this.props.store.admin)) ?
                    <div className="block calls-list">
                        <Translation>
                            {
                                t => <h3>{t('Title Calls')}</h3>
                            }
                        </Translation>
                        <div className="table-scroll">
                            {this.state.pageData.map((o, i) =>
                                <ul className="call-item" key={i} onMouseDown={this.handleDrag}>
                                    <li className="call-location">
                                        <Translation>
                                            {
                                                t => t('Form Location')
                                            }
                                        </Translation>
                                        : {o.location}</li>
                                    <li className="call-id">#{o.id}</li>
                                    <li className="call-time">
                                        <Translation>
                                            {
                                                t => t('Time')
                                            }
                                        </Translation>
                                        : {(new Date(o.time)).toLocaleString()}</li>
                                    <li></li>
                                    <li className="call-phone">
                                        <Translation>
                                            {
                                                t => t('Form Phone')
                                            }
                                        </Translation>
                                        : {o.phone}</li>
                                    <Link
                                        to={"/calls/" + o.id}
                                        className="edit-button round-link"
                                        onClick={() => {
                                            this.setState({ selectedIdx: i + this.state.selectedPage * CALLS_ON_PAGE });
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
                            pageCount={this.state.pageCount}
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
                    : ""}
                <div className="block calls-editor">
                    <div className="title">
                        <h3>
                            <Translation>
                                {
                                    t =>
                                        <Link
                                            to={"/calls"}
                                            className="link"
                                            onClick={() => { this.setState({ selectedIdx: -1 }); }}>
                                            {t('Title New')}
                                        </Link>
                                }
                            </Translation>
                        </h3>
                        <Translation>
                            {
                                t => <h3 onClick={() => { this.sendCall() }}>{t('Title Send')}</h3>
                            }
                        </Translation>
                    </div>
                    <div className="table-scroll">
                        <Translation>
                            {
                                t =>
                                    <Formik
                                        initialValues={(this.state.selectedIdx === -1) ? this.emptyCall : this.props.calls[this.state.selectedIdx]}
                                        enableReinitialize={true}
                                        validate={async values => {
                                            const errors = {};

                                            if (!values.location) {
                                                errors.location = t('Required');
                                            }

                                            if (!values.phone) {
                                                errors.phone = t('Required');
                                            } else if (!/^\d{3}-\d{4}$/i.test(values.phone)) {
                                                errors.phone = t('Invalid Phone');
                                            }

                                            if (!values.text) {
                                                errors.text = t('Required');
                                            }

                                            return errors;
                                        }}
                                        onSubmit={async (values) => {
                                            let tmp = {
                                                location: values.location,
                                                phone: values.phone,
                                                text: values.text
                                            };
                                            this.props.wsClient.publish({ destination: "/api/calls", body: JSON.stringify(tmp) });
                                        }}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form>
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
                                                <div>
                                                    <Field className="text-input" type="text" name="phone" />
                                                    <ErrorMessage name="phone" className="error-label" component="div" />
                                                    <span className="floating-label">
                                                        <Translation>
                                                            {
                                                                t => t('Form Phone')
                                                            }
                                                        </Translation>
                                                    </span>
                                                </div>
                                                <div className="textarea">
                                                    <Field className="text-input" type="text" as="textarea" name="text" />
                                                    <ErrorMessage name="text" className="error-label" component="div" />
                                                    <span className="floating-label">
                                                        <Translation>
                                                            {
                                                                t => t('Form Text')
                                                            }
                                                        </Translation>
                                                    </span>
                                                </div>
                                                <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>


                                                {(this.state.selectedIdx === -1) ? "" :
                                                    <div className="edit-list officers">
                                                        <p className="text-label">
                                                            <Translation>
                                                                {
                                                                    t => t('Officers')
                                                                }
                                                            </Translation>
                                                            : </p>
                                                        {this.props.calls[this.state.selectedIdx].employees.map((e, i) =>
                                                            <Link
                                                                key={i}
                                                                className="round-link"
                                                                to={"/employees/" + e.marking}>
                                                                {e.marking}
                                                            </Link>
                                                        )}
                                                    </div>
                                                }

                                                {(this.state.selectedIdx === -1) ? "" :
                                                    <div className="edit-list report">
                                                        <p className="text-label">
                                                            <Translation>
                                                                {
                                                                    t => t('Title Incidents')
                                                                }
                                                            </Translation>
                                                            : </p>
                                                        {(incidentId) ?
                                                            <Link
                                                                to={"/incidents/" + incidentId}
                                                                className="round-link">
                                                                #{incidentId}
                                                                <span className="link-button" onClick={async (e) => {
                                                                    e.preventDefault();
                                                                    let tmp = {
                                                                        cid: this.props.calls[this.state.selectedIdx].id
                                                                    }
                                                                    this.props.wsClient.publish({ destination: "/api/call/incident/delete", body: JSON.stringify(tmp) });
                                                                }}>
                                                                    <FontAwesomeIcon icon={faTimesCircle} />
                                                                </span>
                                                            </Link>
                                                            : ""}
                                                        <Select styles={{ ...customStyles, container: (provided) => ({ ...provided, margin: "0px" }) }}
                                                            options={this.state.reports.map(r => (
                                                                {
                                                                    value: r,
                                                                    label: r
                                                                })
                                                            )}
                                                            onChange={(e) => { this.setState({ report: e.value }) }}
                                                            placeholder=
                                                            {<Translation>
                                                                {
                                                                    t => t('Incident')
                                                                }
                                                            </Translation>}
                                                            noOptionsMessage={() => "Not found"} />
                                                        <span className="link-button" onClick={async (e) => {
                                                            e.preventDefault();
                                                            if (!this.state.report)
                                                                return;
                                                            let tmp = {
                                                                cid: this.props.calls[this.state.selectedIdx].id,
                                                                iid: this.state.report
                                                            }
                                                            this.props.wsClient.publish({ destination: "/api/call/incident/add", body: JSON.stringify(tmp) });
                                                        }}>
                                                            <FontAwesomeIcon icon={faSave} />
                                                        </span>
                                                    </div>
                                                }
                                            </Form>
                                        )}
                                    </Formik>
                            }
                        </Translation>
                    </div>
                </div>
            </div>
        );
    }
}

export default observer(Calls);