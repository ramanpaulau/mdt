import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios';

const DEPARTMENTS_ON_PAGE = 5;

class Departments extends React.Component {

    emptyDepartment = { shortTitle: "", title: "", description: "", code: -1 };
    emptyRank = { title: "", salary: 0, departmentCode: -1 };

    constructor(props) {
        super(props);

        this.state = {
            depData: [],
            pageData: [],
            ranks: [],
            selectedRanks: [],
            offset: 0,
            selectedDep: -1,
            pageCount: 0,
            selectedRank: -1
        };

        this.sendButton = React.createRef();
    }

    loadDepartments = async () => {
        await axios.get("http://localhost:8081/departments")
            .then((res) => {
                this.setState({
                    depData: res.data
                }, () => this.getPageData());
            });
    }

    loadRanks = async () => {
        await axios.get("http://localhost:8081/ranks")
            .then((res) => {
                this.setState({
                    ranks: res.data
                });
            });
    }

    getNextCode = () => {
        let max = 0;
        this.state.depData.forEach(e => max = (e.code > max) ? e.code : max);
        return max + 1;
    }

    getPageData = () => {
        this.setState({
            pageData: this.state.depData.slice(this.state.offset, this.state.offset + DEPARTMENTS_ON_PAGE),
            pageCount: Math.ceil(this.state.depData.length / DEPARTMENTS_ON_PAGE)
        });
    }

    getSelectedRanks = () => {
        this.setState({ selectedRanks: (this.state.selectedDep === -1) ? [] : this.state.ranks.filter(e => e.departmentCode === this.state.pageData[this.state.selectedDep].code) });
    }

    componentDidMount = () => {
        this.loadDepartments();
        this.loadRanks();
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * DEPARTMENTS_ON_PAGE);

        this.setState({ offset: offset }, () => {
            this.loadDepartments();
        });
    };

    sendDepartment = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    isDepChanging = (code) => this.state.depData.filter((e) => e.code === code).length > 0
    isRankChanging = (title) => this.state.selectedRanks.filter((e) => e.title === title).length > 0

    render() {
        return (
            <div className="departments">
                <div className="block department-list">
                    <h3>Departments</h3>
                    <div className="table-scroll">
                        {this.state.pageData.map((o, i) =>
                            <ul className="department-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="short">{o.shortTitle}</li>
                                <li className="code">Code: {o.code}</li>
                                <li className="title-value">{o.title}</li>
                                <Link
                                    to={"/departments/" + i}
                                    className="edit-button round-link"
                                    onClick={() => this.setState({ selectedDep: i, password: "" }, () => this.getSelectedRanks())}>
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
                <div className="block department-editor">
                    <div className="title">
                        <h3>
                            <Link
                                to={"/departments"}
                                className="link"
                                onClick={() => { this.setState({ selectedDep: -1 }, () => this.getSelectedRanks()); }}>
                                New
                            </Link>
                        </h3>
                        <h3 onClick={() => { this.sendDepartment() }}>Send</h3>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={
                                (this.state.selectedDep === -1) ? { ...this.emptyDepartment, code: this.getNextCode() } : this.state.pageData[this.state.selectedDep]
                            }
                            enableReinitialize={true}
                            validate={async values => {
                                const errors = {};
                                if (!values.shortTitle) {
                                    errors.shortTitle = 'Required';
                                } else if (!/^[A-Za-z]{4,}$/i.test(values.shortTitle)) {
                                    errors.shortTitle = 'Only letters and length > 4';
                                } else if (this.state.depData.filter((e) => e.shortTitle === values.shortTitle || e.code === values.code).length > 1) {
                                    errors.shortTitle = 'Occupied';
                                } else if (!this.isDepChanging(values.code) && this.state.depData.filter((e) => e.shortTitle === values.shortTitle).length > 0) {
                                    errors.shortTitle = 'Occupied';
                                }

                                if (!values.title) {
                                    errors.title = 'Required';
                                } else if (!/^[A-Za-z ]+$/i.test(values.title)) {
                                    errors.title = 'Only letters allowed';
                                }

                                if (!values.description) {
                                    errors.description = 'Required';
                                }

                                if (!values.code) {
                                    errors.code = 'Wrong format';
                                } else if (parseInt(values.code) < 0) {
                                    errors.code = 'Must be positive';
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
                                        this.setState({ depData: [...this.state.depData, tmp] });
                                    else
                                        this.setState({
                                            depData: this.state.depData.map((e) => (e.code === tmp.code) ? tmp : e)
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
                                        <span className="floating-label">Short title</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" name="code" />
                                        <ErrorMessage name="code" className="error-label" component="div" />
                                        <span className="floating-label active-label">Code</span>
                                    </div>
                                    <div className="title-input">
                                        <Field className="text-input" type="text" name="title" />
                                        <ErrorMessage name="title" className="error-label" component="div" />
                                        <span className="floating-label">Title</span>
                                    </div>
                                    <div className="textarea">
                                        <Field className="text-input" type="text" as="textarea" name="description" />
                                        <ErrorMessage name="description" className="error-label" component="div" />
                                        <span className="floating-label">Description</span>
                                    </div>
                                    <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="block department-ranks">
                    <h3>Ranks</h3>
                    <div className="table-scroll">
                        <div className="rank-form">
                            <Formik
                                initialValues={
                                    (this.state.selectedRank === -1) ? this.emptyRank : this.state.selectedRanks[this.state.selectedRank]
                                }
                                enableReinitialize={true}
                                validate={async values => {
                                    const errors = {};
                                    if (!values.title) {
                                        errors.title = 'Required';
                                    } else if (!/^[A-Za-z ]+$/i.test(values.title)) {
                                        errors.title = 'Only letters allowed';
                                    }
                                    console.log(parseInt(values.salary));
                                    if (!values.salary) {
                                        errors.salary = 'Wrong format';
                                    } else if (parseInt(values.salary) < 0 || 32767 < parseInt(values.salary)) {
                                        errors.salary = 'Must be in range [0, 32767]';
                                    }

                                    return errors;
                                }}
                                onSubmit={async (values) => {
                                    if (this.state.selectedDep === -1)
                                        return;
                                    let tmp = {
                                        title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
                                        salary: parseInt(values.salary),
                                        departmentCode: this.state.pageData[this.state.selectedDep].code
                                    };
                                    console.log(tmp);
                                    await axios.post("http://localhost:8081/rank", tmp).then(() => {
                                        this.setState({ 
                                            ranks: (!this.isRankChanging(tmp.title)) ? [...this.state.ranks, tmp] : this.state.ranks.map((e) => (e.title === tmp.title) ? tmp : e ),
                                            selectedRank: -1
                                        });
                                        this.getSelectedRanks();
                                    })
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div>
                                            <Field className="text-input" type="text" style={{ textTransform: "capitalize" }} name="title" />
                                            <ErrorMessage name="title" className="error-label" component="div" />
                                            <span className="floating-label">Title</span>
                                        </div>
                                        <div>
                                            <Field className="text-input" type="number" name="salary" />
                                            <ErrorMessage name="salary" className="error-label" component="div" />
                                            <span className="floating-label active-label">Salary - $/hour</span>
                                        </div>
                                        <button className="round-link" type="submit"><FontAwesomeIcon icon={faPlus}/></button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        {this.state.selectedRanks.map((o, i) =>
                            <ul className="rank" key={i}>
                                <li>{o.title}</li>
                                <li>{o.salary} $/hour</li>
                                <li className="controls">
                                    <button className="round-link" type="submit" onClick={() => this.setState({ selectedRank: i })}>Edit</button>
                                    <button className="round-link" type="submit" onClick={() => this.setState({ selectedRank: i })}><FontAwesomeIcon icon={faTimesCircle} /></button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
                <div className="block department-units">
                    <h3>Units</h3>
                    <div className="table-scroll">

                    </div>
                </div>
            </div >
        );
    }
}

export default Departments;