import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus, faSave, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios';

const DEPARTMENTS_ON_PAGE = 5;

class Departments extends React.Component {

    emptyDepartment = { shortTitle: "", title: "", description: "", code: "" };

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            pageData: [],
            offset: 0,
            selectedIdx: -1,
            pageCount: 0
        };

        this.sendButton = React.createRef();
    }

    loadDepartments = async () => {
        await axios.get("http://localhost:8081/departments")
            .then((res) => {
                this.setState({
                    data: res.data
                }, () => this.getPageData());
            });
    }

    getNextCode = () => {
        let max = 0;
        this.state.data.forEach(e => max = (e.code > max) ? e.code : max);
        return max + 1;
    }

    getPageData = () => {
        this.setState({
            pageData: this.state.data.slice(this.state.offset, this.state.offset + DEPARTMENTS_ON_PAGE),
            pageCount: Math.ceil(this.state.data.length / DEPARTMENTS_ON_PAGE)
        });
    }

    componentDidMount = () => {
        this.loadDepartments();
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

    isChanging = (code) => this.state.data.filter((e) => e.code === code).length > 0

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
                                    onClick={() => this.setState({ selectedIdx: i, password: "" })}>
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
                                onClick={() => { this.setState({ selectedIdx: -1 }); }}>
                                New
                            </Link>
                        </h3>
                        <h3 onClick={() => { this.sendDepartment() }}>Send</h3>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={
                                (this.state.selectedIdx === -1) ? { ...this.emptyDepartment, code: this.getNextCode() } : this.state.pageData[this.state.selectedIdx]
                            }
                            enableReinitialize={true}
                            validate={async values => {
                                const errors = {};
                                if (!values.shortTitle) {
                                    errors.shortTitle = 'Required';
                                } else if (!/^[A-Za-z]{4,}$/i.test(values.shortTitle)) {
                                    errors.shortTitle = 'Only letters and length > 4';
                                } else if (this.state.data.filter((e) => e.shortTitle === values.shortTitle || e.code === values.code).length > 1) {
                                    errors.shortTitle = 'Occupied';
                                } else if (!this.isChanging(values.code) && this.state.data.filter((e) => e.shortTitle === values.shortTitle).length > 0) {
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
                                    if (!this.isChanging(tmp.code))
                                        this.setState({ data: [...this.state.data, tmp] });
                                    else
                                        this.setState({
                                            data: this.state.data.map((e) => (e.code === tmp.code) ? tmp : e)
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