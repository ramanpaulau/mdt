import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus, faChevronLeft, faChevronRight, faSave } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios';
import { observer } from "mobx-react";
import Select from 'react-select';
import { customStyles } from "./Employees";
import { Translation } from 'react-i18next';

const DEPARTMENTS_ON_PAGE = 5;

class Departments extends React.Component {

    emptyDepartment = { shortTitle: "", title: "", description: "", code: -1 };
    emptyRank = { title: "", salary: 0, department: -1 };
    emptyUnit = { title: "", abbreviation: "", description: "", department: -1 };

    constructor(props) {
        super(props);

        this.state = {
            departments: [],
            pageData: [],
            ranks: [],
            units: [],
            employees: [],
            leader: null,
            selectedRanks: [],
            selectedUnits: [],
            offset: 0,
            selectedDep: -1,
            selectedPage: 0,
            selectedRank: -1,
            selectedUnit: -1,
            pageCount: 0
        };

        this.sendButton = React.createRef();
    }

    loadDepartments = async () => {
        await axios.get("http://localhost:8081/departments")
            .then((res) => {
                let selectedIdx = -1;
                if (this.props.match.params.code)
                    selectedIdx = res.data.findIndex(d => d.code === parseInt(this.props.match.params.code));
                this.setState({
                    selectedDep: selectedIdx,
                    departments: res.data
                }, () => this.getPageData());
            });
    }

    loadRanks = async () => {
        await axios.get("http://localhost:8081/ranks")
            .then((res) => {
                this.setState({
                    ranks: res.data
                }, () => this.getSelectedRanks());
            });
    }

    loadUnits = async () => {
        await axios.get("http://localhost:8081/units")
            .then((res) => {
                this.setState({
                    units: res.data
                }, () => this.getSelectedUnits());
            });
    }

    getNextCode = () => {
        let max = 0;
        this.state.departments.forEach(e => max = (e.code > max) ? e.code : max);
        return max + 1;
    }

    getPageData = () => {
        this.setState({
            pageData: this.state.departments.slice(this.state.offset, this.state.offset + DEPARTMENTS_ON_PAGE),
            pageCount: Math.ceil(this.state.departments.length / DEPARTMENTS_ON_PAGE)
        });
    }

    getSelectedRanks = () => {
        this.setState({ selectedRanks: (this.state.selectedDep === -1) ? [] : this.state.ranks.filter(e => e.department === this.state.departments[this.state.selectedDep].code) });
    }

    getSelectedUnits = () => {
        this.setState({ selectedUnits: (this.state.selectedDep === -1) ? [] : this.state.units.filter(e => e.department === this.state.departments[this.state.selectedDep].code) });
    }

    getEmployees = async () => {
        if (this.state.selectedDep === -1)
            return;
        await axios.get("http://localhost:8081/employees/department/" + this.state.departments[this.state.selectedDep].code).then(res => {
            this.setState({
                employees: res.data,
                leader: this.state.departments[this.state.selectedDep].leader
            });
        });
    }

    componentDidMount = async () => {
        await axios.all([
            axios.get("http://localhost:8081/departments"),
            axios.get("http://localhost:8081/ranks"),
            axios.get("http://localhost:8081/units")])
            .then(axios.spread((firstResponse, secondResponse, thirdResponse) => {
                let dep = parseInt(this.props.match.params.code);
                this.setState({
                    departments: firstResponse.data,
                    ranks: secondResponse.data,
                    units: thirdResponse.data,
                    selectedDep: (dep) ? firstResponse.data.findIndex(d => d.code === dep) : -1
                }, () => {
                    this.getSelectedRanks();
                    this.getSelectedUnits();
                    this.getPageData();
                    this.getEmployees();
                })
            }))
            .catch(error => console.log(error));
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * DEPARTMENTS_ON_PAGE);

        this.setState({ offset: offset, selectedPage: selected }, () => {
            this.loadDepartments();
        });
    };

    sendDepartment = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    isDepChanging = (code) => this.state.departments.filter((e) => e.code === code).length > 0
    isRankChanging = (title) => this.state.selectedRanks.filter((e) => e.title === title).length > 0
    isUnitChanging = (abbreviation) => this.state.selectedUnits.filter((e) => e.abbreviation === abbreviation).length > 0

    setMain = async (abbreviation) => {
        let code = this.state.departments[this.state.selectedDep].code;
        await axios.post("http://localhost:8081/department/" + code + "/main/" + abbreviation).then(res => {
            if (!res.data.success)
                console.log(res.data.message);
            this.loadDepartments();
        });
    }

    sendLeader = async () => {
        let code = this.state.departments[this.state.selectedDep].code;
        await axios.post("http://localhost:8081/department/" + code + "/leader/" + this.state.leader);
    }

    render() {
        return (
            <div className="departments">
                <div className="block department-list">
                    <Translation>
                        {
                            t => <h3>{t('Title Departments')}</h3>
                        }
                    </Translation>
                    <div className="table-scroll">
                        {this.state.pageData.map((o, i) =>
                            <ul className="department-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="short">{o.shortTitle}</li>
                                <li className="code">
                                    <Translation>
                                        {
                                            t => t('Code')
                                        }
                                    </Translation>: {o.code}</li>
                                <li className="title-value">{o.title}</li>
                                <Link
                                    to={"/departments/" + o.code}
                                    className="edit-button round-link"
                                    onClick={() => this.setState({ selectedDep: i + this.state.selectedPage * DEPARTMENTS_ON_PAGE }, () => { this.getSelectedRanks(); this.getSelectedUnits(); this.getEmployees(); })}>
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
                {((this.props.store.employeeId) || (this.props.store.admin)) ?
                    <div className="block department-editor">
                        <div className="title">
                            <h3>
                                <Translation>
                                    {
                                        t =>
                                            <Link
                                                to={"/departments"}
                                                className="link"
                                                onClick={() => { this.setState({ selectedDep: -1 }, () => { this.getSelectedRanks(); this.getSelectedUnits(); }); }}>
                                                {t('Title New')}
                                            </Link>
                                    }
                                </Translation>
                            </h3>
                            <Translation>
                                {
                                    t => <h3 onClick={() => {
                                        if (this.props.store.admin)
                                            this.sendDepartment();
                                    }}>{t('Title Send')}</h3>
                                }
                            </Translation>
                        </div>
                        <div className="table-scroll">
                            <Translation>
                                {
                                    t =>
                                        <Formik
                                            initialValues={
                                                (this.state.selectedDep === -1) ? { ...this.emptyDepartment, code: this.getNextCode() } : (this.state.departments[this.state.selectedDep]) ? this.state.departments[this.state.selectedDep] : { ...this.emptyDepartment, code: this.getNextCode() }
                                            }
                                            enableReinitialize={true}
                                            validate={async values => {
                                                const errors = {};
                                                if (!values.shortTitle) {
                                                    errors.shortTitle = t('Required');
                                                } else if (!/^[A-Za-z]{4,}$/i.test(values.shortTitle)) {
                                                    errors.shortTitle = t('Only Letters');
                                                } else if (this.state.departments.filter((e) => e.shortTitle === values.shortTitle || e.code === values.code).length > 1) {
                                                    errors.shortTitle = t('Occupied');
                                                } else if (!this.isDepChanging(values.code) && this.state.departments.filter((e) => e.shortTitle === values.shortTitle).length > 0) {
                                                    errors.shortTitle = t('Occupied');
                                                }

                                                if (!values.title) {
                                                    errors.title = t('Required');
                                                } else if (!/^[A-Za-z ]+$/i.test(values.title)) {
                                                    errors.title = t('Only Letters');
                                                }

                                                if (!values.description) {
                                                    errors.description = t('Required');
                                                }

                                                if (!values.code) {
                                                    errors.code = t('Invalid Format');
                                                } else if (parseInt(values.code) < 0) {
                                                    errors.code = t('Invalid Negative');
                                                }

                                                return errors;
                                            }}
                                            onSubmit={async (values) => {
                                                let tmp = {
                                                    shortTitle: values.shortTitle.toUpperCase(),
                                                    title: values.title.toUpperCase(),
                                                    description: values.description,
                                                    code: values.code
                                                };
                                                await axios.post("http://localhost:8081/department/", tmp).then(() => {
                                                    if (!this.isDepChanging(tmp.code))
                                                        this.setState({ departments: [...this.state.departments, tmp] });
                                                    else
                                                        this.setState({
                                                            departments: this.state.departments.map((e) => (e.code === tmp.code) ? tmp : e)
                                                        });
                                                    this.getPageData();
                                                })
                                            }}
                                        >
                                            {({ isSubmitting }) => (
                                                <Form>
                                                    <div>
                                                        <Field className="text-input" type="text" style={{ textTransform: "uppercase" }} name="shortTitle" />
                                                        <ErrorMessage name="shortTitle" className="error-label" component="div" />
                                                        <span className="floating-label">
                                                            <Translation>
                                                                {
                                                                    t => t('Form Short Title')
                                                                }
                                                            </Translation>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Field className="text-input" type="number" name="code" />
                                                        <ErrorMessage name="code" className="error-label" component="div" />
                                                        <span className="floating-label active-label">
                                                            <Translation>
                                                                {
                                                                    t => t('Code')
                                                                }
                                                            </Translation>
                                                        </span>
                                                    </div>
                                                    <div className="title-input">
                                                        <Field className="text-input" type="text" name="title" />
                                                        <ErrorMessage name="title" className="error-label" component="div" />
                                                        <span className="floating-label">
                                                            <Translation>
                                                                {
                                                                    t => t('Form Title')
                                                                }
                                                            </Translation>
                                                        </span>
                                                    </div>
                                                    <div className="textarea">
                                                        <Field className="text-input" type="text" as="textarea" name="description" />
                                                        <ErrorMessage name="description" className="error-label" component="div" />
                                                        <span className="floating-label">
                                                            <Translation>
                                                                {
                                                                    t => t('Form Description')
                                                                }
                                                            </Translation>
                                                        </span>
                                                    </div>
                                                    <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>
                                                </Form>
                                            )}
                                        </Formik>
                                }
                            </Translation>
                            {(this.props.store.admin && this.state.selectedDep !== -1) ?
                                <div className="edit-list department" style={{ display: "flex", flexDirection: "column" }}>
                                    <p className="text-label">
                                        <Translation>
                                            {
                                                t => t('Leader')
                                            }
                                        </Translation>
                                        : </p>
                                    <Select styles={{ ...customStyles, container: (provided) => ({ ...provided, width: "224px" }) }}
                                        options={this.state.employees.map(e => (
                                            {
                                                value: e.id,
                                                label: e.fullName
                                            })
                                        )}
                                        onChange={(e) => { this.setState({ leader: e.value }) }}
                                        value={(this.state.employees.filter(e => e.id === this.state.leader)[0]) ? { value: this.state.leader, label: this.state.employees.filter(e => e.id === this.state.leader)[0].fullName } : null}
                                        placeholder=
                                        {<Translation>
                                            {
                                                t => t('Title Employees')
                                            }
                                        </Translation>}
                                        noOptionsMessage={() =>
                                            <Translation>
                                                {
                                                    t => t('Not found')
                                                }
                                            </Translation>} />
                                    <div>
                                        <span className="link-button" onClick={(e) => { e.preventDefault(); this.sendLeader(); }}>
                                            <FontAwesomeIcon icon={faSave} />
                                        </span>
                                    </div>
                                </div> : ""}
                        </div>
                    </div>
                    : ""}
                {((this.props.store.leader) || (this.props.store.admin)) ?
                    <div className="block department-ranks">
                        <Translation>
                            {
                                t => <h3>{t('Title Ranks')}</h3>
                            }
                        </Translation>
                        <div className="table-scroll">
                            <div className="rank-form">
                                <Translation>
                                    {
                                        t =>
                                            <Formik
                                                initialValues={
                                                    (this.state.selectedRank === -1) ? this.emptyRank : this.state.selectedRanks[this.state.selectedRank]
                                                }
                                                enableReinitialize={true}
                                                validate={async values => {
                                                    const errors = {};
                                                    if (!values.title) {
                                                        errors.title = t('Required')
                                                    } else if (!/^[A-Za-z ]+$/i.test(values.title)) {
                                                        errors.title = t('Only Letters')
                                                    }

                                                    if (!values.salary) {
                                                        errors.salary = t('Invalid Format');
                                                    } else if (parseInt(values.salary) < 0) {
                                                        errors.salary = t('Invalid Negative')
                                                    }

                                                    return errors;
                                                }}
                                                onSubmit={async (values) => {
                                                    if (this.state.selectedDep === -1)
                                                        return;
                                                    let tmp = {
                                                        title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
                                                        salary: parseInt(values.salary),
                                                        department: this.state.departments[this.state.selectedDep].code
                                                    };
                                                    await axios.post("http://localhost:8081/rank",
                                                        JSON.stringify(tmp),
                                                        { headers: { 'Content-Type': 'text/plain' } }).then((res) => {
                                                            if (!res.data.success)
                                                                console.log(res.data.message);
                                                            else {
                                                                this.setState({
                                                                    ranks: (!this.isRankChanging(tmp.title)) ? [...this.state.ranks, tmp] : this.state.ranks.map((e) => (e.title === tmp.title) ? tmp : e),
                                                                    selectedRank: -1
                                                                });
                                                                this.getSelectedRanks();
                                                            }
                                                        })
                                                }}
                                            >
                                                {({ isSubmitting }) => (
                                                    <Form>
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
                                                            <Field className="text-input" type="number" name="salary" />
                                                            <ErrorMessage name="salary" className="error-label" component="div" />
                                                            <span className="floating-label active-label"><Translation>
                                                                {
                                                                    t => t('Form Salary')
                                                                }
                                                            </Translation> - $/<Translation>
                                                                    {
                                                                        t => t('Form Hour')
                                                                    }
                                                                </Translation></span>
                                                        </div>
                                                        <button className="round-link" type="submit"><FontAwesomeIcon icon={faPlus} /></button>
                                                    </Form>
                                                )}
                                            </Formik>
                                    }
                                </Translation>
                            </div>
                            {this.state.selectedRanks.map((o, i) =>
                                <ul className="rank" key={i}>
                                    <li>{o.title}</li>
                                    <li>{o.salary} $/<Translation>
                                        {
                                            t => t('Form Hour')
                                        }
                                    </Translation></li>
                                    <li className="controls">
                                        <button className="round-link" type="submit" onClick={() => this.setState({ selectedRank: i })}>
                                            <Translation>
                                                {
                                                    t => t('Button Edit')
                                                }
                                            </Translation>
                                        </button>
                                        <button className="round-link" type="submit" onClick={async () => {
                                            let tmp = {
                                                title: o.title,
                                                dep: this.state.departments[this.state.selectedDep].code
                                            }
                                            await await axios.delete("http://localhost:8081/rank/" + tmp.title + "/department/" + tmp.dep).then(() => this.loadRanks());
                                        }}><FontAwesomeIcon icon={faTimesCircle} /></button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                    : ""}
                {((this.props.store.leader) || (this.props.store.admin)) ?
                    <div className="block department-units">
                        <Translation>
                            {
                                t => <h3>{t('Title Units')}</h3>
                            }
                        </Translation>
                        <div className="table-scroll">
                            <div className="rank-form">
                        <Translation>
                            {
                                t =>
                                <Formik
                                    initialValues={
                                        (this.state.selectedUnit === -1) ? this.emptyUnit : this.state.selectedUnits[this.state.selectedUnit]
                                    }
                                    enableReinitialize={true}
                                    validate={async values => {
                                        const errors = {};

                                        if (!values.title) {
                                            errors.title = t('Required');
                                        } else if (!/^[A-Za-z ]+$/i.test(values.title)) {
                                            errors.title = t('Only Letters');
                                        }

                                        if (!values.abbreviation) {
                                            errors.abbreviation = t('Required');
                                        } else if (!/^[A-Za-z ]+$/i.test(values.abbreviation)) {
                                            errors.abbreviation = t('Only Letters');
                                        }

                                        if (!values.description) {
                                            errors.description = 'Required';
                                        }

                                        return errors;
                                    }}
                                    onSubmit={async (values) => {
                                        if (this.state.selectedDep === -1)
                                            return;
                                        let tmp = {
                                            title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
                                            abbreviation: values.abbreviation.toUpperCase(),
                                            description: values.description,
                                            department: this.state.departments[this.state.selectedDep].code
                                        };
                                        await axios.post("http://localhost:8081/unit", tmp).then((res) => {
                                            if (!res.data.success) {
                                                console.log(res.data.message);
                                                return;
                                            }

                                            this.setState({
                                                units: (!this.isUnitChanging(tmp.abbreviation)) ? [...this.state.units, tmp] : this.state.units.map((e) => (e.abbreviation === tmp.abbreviation) ? tmp : e),
                                                selectedUnit: -1
                                            });
                                            this.getSelectedUnits();
                                        })
                                    }}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
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
                                                <Field className="text-input" type="text" name="abbreviation" style={{ textTransform: "uppercase" }} />
                                                <ErrorMessage name="abbreviation" className="error-label" component="div" />
                                                <span className="floating-label active-label">
                                                    <Translation>
                                                        {
                                                            t => t('Form Abbreviation')
                                                        }
                                                    </Translation>
                                                </span>
                                            </div>
                                            <div>
                                                <Field className="text-input" type="text" name="description" />
                                                <ErrorMessage name="description" className="error-label" component="div" />
                                                <span className="floating-label active-label">
                                                    <Translation>
                                                        {
                                                            t => t('Form Description')
                                                        }
                                                    </Translation>
                                                </span>
                                            </div>
                                            <button className="round-link" type="submit"><FontAwesomeIcon icon={faPlus} /></button>
                                        </Form>
                                    )}
                                </Formik>
                            }
                        </Translation>
                            </div>
                            {this.state.selectedUnits.map((o, i) =>
                                <ul className="rank" key={i}>
                                    <li>{o.title}</li>
                                    <li>
                                        <Translation>
                                            {
                                                t => t('Form Abbreviation')
                                            }
                                        </Translation>: {o.abbreviation}</li>
                                    <li>{o.description}</li>
                                    <li className="controls">
                                        {this.state.departments[this.state.selectedDep] && this.state.departments[this.state.selectedDep].unit !== o.abbreviation &&
                                            <button className="round-link" type="submit" onClick={() => { this.setMain(o.abbreviation); }}>
                                                <Translation>
                                                    {
                                                        t => t('Button Main')
                                                    }
                                                </Translation>
                                            </button>
                                        }
                                        <button className="round-link" type="submit" onClick={() => this.setState({ selectedUnit: i })}>
                                            <Translation>
                                                {
                                                    t => t('Button Edit')
                                                }
                                            </Translation>
                                        </button>
                                        {this.state.departments[this.state.selectedDep] && this.state.departments[this.state.selectedDep].unit !== o.abbreviation &&
                                            <button className="round-link" type="submit" onClick={async () => {
                                                let tmp = {
                                                    abbr: o.abbreviation,
                                                    dep: this.state.departments[this.state.selectedDep].code
                                                }
                                                await await axios.delete("http://localhost:8081/unit/" + tmp.abbr + "/department/" + tmp.dep).then(() => this.loadUnits());
                                            }}><FontAwesomeIcon icon={faTimesCircle} /></button>
                                        }
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                    : ""}
            </div>
        );
    }
}

export default observer(Departments);