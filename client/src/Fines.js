import axios from "axios";
import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSave } from '@fortawesome/free-solid-svg-icons';
import { observer } from "mobx-react";
import SelectLaws from "./ModalWindows/SelectLaws";
import { customStyles } from "./Employees";
import Select from 'react-select';
import { Translation } from 'react-i18next';

const FINES_ON_PAGE = 7;

class Fines extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filter: '',
            filteredData: [],
            pageData: [],
            fines: [],
            fine: 0,
            citizen: "",
            offset: 0,
            selectedPage: 0,
            selectedLaws: [],
            pageCount: 0,
            state: { value: true, label: "Paid" }
        };

        this.sendButton = React.createRef();
    }

    componentDidMount = () => {
        this.loadFines();
    }

    loadFines = async () => {
        await axios.get("http://localhost:8081/fines").then(res => {
            this.setState({ fines: res.data }, () => { this.getPageData() });
        });
    }

    getPageData = () => {
        console.log(this.state.filter);
        this.setState({
            pageData: (this.state.filter) ? this.state.filteredData.slice(this.state.offset, this.state.offset + FINES_ON_PAGE) : this.state.fines.slice(this.state.offset, this.state.offset + FINES_ON_PAGE),
            pageCount: (this.state.filter) ? Math.ceil(this.state.filteredData.length / FINES_ON_PAGE) : Math.ceil(this.state.fines.length / FINES_ON_PAGE)
        });
    }

    saveLaws = (laws) => {
        let fine = 0;
        laws.map(l => { fine += l.fine; return l; });
        this.setState({ selectedLaws: laws, fine: fine });
    }

    sendFine = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    render() {
        return (
            <div className="fines">
                <div className="block fine-list">
                    <Translation>
                        {
                            t => <h3>{t('Title Fines')}</h3>
                        }
                    </Translation>
                    <div className="table-scroll">
                        <input placeholder="Filter" className="text-input" type="text" value={this.state.filter} onChange={(e) => this.setState({ filter: e.target.value, filteredData: this.state.fines.filter(f => (f.person).includes(e.target.value.toUpperCase())) }, () => this.getPageData())} />
                        {this.state.pageData.map((o, i) =>
                            <ul className="fine-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="">{o.employee}</li>
                                <li className="">{o.laws}</li>
                                <li className="">{o.amount}$</li>
                                <li>
                                    <State id={o.id} state={o.state} />
                                </li>
                                <Link
                                    to={"/fines/" + (o.person)}
                                    className="edit-button round-link">
                                    {o.person}
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
                <div className="block fine-editor">
                    <div className="title">
                        <h3>
                            <Translation>
                                {
                                    t =>
                                        <Link
                                            to={"/fines"}
                                            className="link"
                                            onClick={() => { this.setState({ selectedIdx: -1 }); }}>
                                            {t('Title New')}
                                        </Link>
                                }
                            </Translation>
                        </h3>
                        <Translation>
                            {
                                t => <h3 onClick={() => { this.sendFine() }}>{t('Title Send')}</h3>
                            }
                        </Translation>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={{
                                fine: this.state.fine
                            }}
                            enableReinitialize={true}
                            validate={async values => {
                                const errors = {};
                                return errors;
                            }}
                            onSubmit={async (values) => {
                                await axios.post("http://localhost:8081/fine", { citizen: this.state.citizen, amount: values.fine, laws: this.state.selectedLaws.map(l => l.number).join(','), employee: this.props.store.employeeId }).then(res => {
                                    if (!res.data.success)
                                        console.log(res.data.message);
                                });
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
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
        )
    }
}

export default observer(Fines);

class State extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.state
        }
    }

    sendState = async () => {
        await axios.post("http://localhost:8081/fine/" + this.props.id + "/state/" + this.state.value).then(res => {
            if (!res.data.success)
                console.log(res.data.message);
        });
    }

    render() {
        return (
            <div className="edit-list fine-state">
                <select onChange={(e) => { this.setState({ value: e.target.value }); }} defaultValue={this.state.value} >
                    <option value={true} >Paid</option>
                    <option value={false} >Not paid</option>
                </select>
                <span className="link-button" onClick={(e) => { e.preventDefault(); this.sendState(); }}>
                    <FontAwesomeIcon icon={faSave} />
                </span>
            </div>
        )
    }
}