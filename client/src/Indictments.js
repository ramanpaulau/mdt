import React from "react";
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from 'react-router-dom';
import Select from 'react-select'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import axios from 'axios';
import { observer } from "mobx-react";
import { customStyles } from "./Employees";
import SelectLaws from "./ModalWindows/SelectLaws"

const INDICTMENTS_ON_PAGE = 3;

class Indictments extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pageData: [],
            indictments: [],
            incidents: [],
            departments: [],
            citizen: "",
            department: -1,
            incident: -1,
            selectedLaws: [],
            offset: 0,
            detention: 0,
            fine: 0,
            startTime: new Date(),
            endTime: new Date(),
            selectedIdx: -1,
            selectedPage: 0,
            pageCount: 0
        };

        this.sendButton = React.createRef();
    }

    componentDidMount = () => {
        this.loadData();
        this.loadIndictments();
    }

    getPageData = () => {
        this.setState({
            pageData: this.state.indictments.slice(this.state.offset, this.state.offset + INDICTMENTS_ON_PAGE),
            pageCount: Math.ceil(this.state.indictments.length / INDICTMENTS_ON_PAGE)
        });
    }

    loadData = async () => {
        await axios.all([
            axios.get("http://localhost:8081/departments"),
            axios.get("http://localhost:8081/incidents")])
            .then(axios.spread((firstResponse, secondResponse) => {
                this.setState({
                    departments: firstResponse.data,
                    incidents: secondResponse.data
                })
            })
            )
            .catch(error => console.log(error));
    }

    loadIndictments = async () => {
        await axios.get("http://localhost:8081/indictments").then(res => {
            this.setState({
                indictments: res.data
            }, () => { this.getPageData() });
        });
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * INDICTMENTS_ON_PAGE);

        this.setState({ offset: offset, selectedPage: selected }, () => {
            this.loadIndictments();
        });
    };

    saveLaws = (laws) => {
        let detention = 0, fine = 0;
        laws.map(l => { detention += l.detention; fine += l.fine; return l; });
        this.setState({ selectedLaws: laws, detention: detention, fine: fine, endTime: new Date(this.state.startTime.getTime() + detention * 60000) });
    }

    sendIndictment = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    render() {
        return (
            <div className="indictments">
                <div className="block indictment-list">
                    <h3>Indictments</h3>
                    <div className="table-scroll">
                        {this.state.pageData.map((o, i) =>
                            <ul className="incident-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="id">#{o.id}</li>
                                <li className="">Start time: {new Date(o.startTime).toLocaleString()}</li>
                                <li className="">End time: {new Date(o.endTime).toLocaleString()}</li>
                                <li className="">Added: {o.employee}</li>
                                <li className="">{o.laws}</li>
                                <li className="">{o.person}</li>
                                <Link
                                    to={"/indictments/" + (o.id)}
                                    className="edit-button round-link"
                                    onClick={() => {
                                        this.setState({ selectedIdx: i + this.state.selectedPage * INDICTMENTS_ON_PAGE });
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
                <div className="block indictment-editor">
                    <div className="title">
                        <h3>
                            <Link
                                to={"/indictments"}
                                className="link"
                                onClick={() => { this.setState({ selectedIdx: -1 }); }}>
                                New
                            </Link>
                        </h3>
                        <h3 onClick={() => { this.sendIndictment() }}>Send</h3>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={{
                                detention: this.state.detention,
                                fine: this.state.fine
                            }}
                            enableReinitialize={true}
                            validate={async values => {
                                const errors = {};

                                if (values.detention <= 0)
                                    errors.detention = "Value must be > 0";
                                else
                                    this.setState({ endTime: new Date(this.state.startTime.getTime() + values.detention * 60000) })

                                return errors;
                            }}
                            onSubmit={async (values) => {
                                let tmp = {
                                    citizen: this.state.citizen,
                                    department: this.state.department,
                                    incident: this.state.incident,
                                    startTime: this.state.startTime.toLocaleString(),
                                    endTime: this.state.endTime.toLocaleString(),
                                    employee: this.props.store.employeeId,
                                    laws: this.state.selectedLaws.map(l => l.number).join(',')
                                };
                                await axios.post("http://localhost:8081/indictment", tmp).then(res => {
                                    if (!res.data.success)
                                        console.log(res.data.message);
                                    else {
                                        this.setState({ indictments: [...this.state.indictments, tmp] }, () => { this.getPageData() });
                                    }
                                });
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="edit-list incident">
                                        <Select styles={{ ...customStyles, container: (provided) => ({ ...provided, width: "224px" }) }}
                                            options={this.state.incidents.map(i => (
                                                {
                                                    value: i.id,
                                                    label: i.id
                                                })
                                            )}
                                            onChange={(e) => { this.setState({ incident: e.value }) }}
                                            placeholder="Incident"
                                            noOptionsMessage={() => "Not found"} />
                                    </div>
                                    <div className="edit-list department">
                                        <Select styles={{ ...customStyles, container: (provided) => ({ ...provided, width: "224px" }) }}
                                            options={this.state.departments.map(d => (
                                                {
                                                    value: d.code,
                                                    label: d.shortTitle
                                                })
                                            )}
                                            onChange={(e) => { this.setState({ department: e.value }) }}
                                            placeholder="Department"
                                            noOptionsMessage={() => "Not found"} />
                                    </div>
                                    <div className="edit-list citizen">
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
                                    </div>
                                    <div className="start-date">
                                        <Datetime value={this.state.startTime} onChange={(e) => { this.setState({ startTime: new Date(e) }) }} />
                                        <span className="floating-label active-label">Start</span>
                                    </div>
                                    <div className="end-fate">
                                        <p className="text-label">End: {this.state.endTime.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" name="detention" />
                                        <ErrorMessage name="detention" className="error-label" component="div" />
                                        <span className="floating-label active-label">Detention</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" name="fine" />
                                        <ErrorMessage name="fine" className="error-label" component="div" />
                                        <span className="floating-label active-label">Fine</span>
                                    </div>
                                    <SelectLaws callback={(laws) => this.saveLaws(laws)} />
                                    <div>
                                        <p className="text-label">Selected laws: </p>
                                        <div className="laws">
                                            {this.state.selectedLaws.map(l =>
                                                <Link to="/penalcode" key={l.number} className="round-link" >
                                                    {l.number}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div >
        );
    }
}

export default observer(Indictments);