import React from "react";
import Select from 'react-select'
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { customStyles } from './Employees';
import { useSelect } from "react-select-search";

class Inventory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            departments: [],
            inventory: [],
            pageData: [1, 2, 3],
            description: "",
            department: 0,
            amount: 0
        }

        this.sendButton = React.createRef();
    }

    componentDidMount = async () => {
        this.loadDepartments();
        this.loadInventory();
    }

    loadDepartments = async () => {
        await axios.get("http://localhost:8081/departments").then(res => {
            this.setState({
                departments: res.data
            })
        });
    }

    loadInventory = async () => {
        await axios.get("http://localhost:8081/inventory").then(res => {
            this.setState({
                inventory: res.data
            })
        });
    }

    sendItem = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    proceedAction = (description, amount, action) => {
        if (!amount)
            return;
        console.log(description, amount, action);
    }

    sendToHistory = () => {

    }

    render() {
        let filteredInventory = this.state.inventory.filter(e => e.department === this.state.department);

        return (
            <div className="inventory">
                <div className="block inventory-list">
                    <div className="title title-select">
                        <h3>Inventory</h3>
                        <div>
                            <Select styles={{ ...customStyles, container: (provided) => ({ ...provided }) }}
                                options={this.state.departments.map(d => (
                                    {
                                        value: d.code,
                                        label: d.shortTitle
                                    })
                                )}
                                onChange={(e) => { this.setState({ department: e.value }) }}
                                placeholder="Department"
                                noOptionsMessage={() => "Department not found"} />
                        </div>
                    </div>
                    <div className="table-scroll">
                        {filteredInventory.map((e, i) =>
                            <ul key={i} className="inventory-item">
                                <li>{e.description}</li>
                                <li>{e.amount}</li>
                                <SelectAmount callback={(amount, action) => this.proceedAction(e.description, amount, action)} max={e.amount} />
                            </ul>
                        )}
                    </div>
                </div>
                <div className="block inventory-editor">
                    <div className="title">
                        <h3>
                            <Link
                                to={"/inventory"}
                                className="link"
                                onClick={() => this.clearForm()}>
                                New
                            </Link>
                        </h3>
                        <h3 onClick={() => this.sendItem()}>Send</h3>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={{ description: "", amount: 0 }}
                            validate={async values => {
                                const errors = {};

                                if (!values.amount) {
                                    errors.amount = 'Required';
                                } else if (!/^[1-9][0-9]?$/i.test(values.amount)) {
                                    errors.amount = '1-99';
                                }

                                if (!values.description) {
                                    errors.description = 'Required';
                                }

                                return errors;
                            }}
                            onSubmit={async (values) => {
                                if (!this.state.department)
                                    return;
                                let tmp = {
                                    description: values.description,
                                    amount: values.amount,
                                    department: this.state.department
                                }
                                await axios.post("http://localhost:8081/inventory/record", tmp).then(res => {
                                    if (!res.data.success)
                                        console.log(res.data.message);
                                    else
                                        this.loadInventory();
                                });
                            }}
                        >
                            {() => (
                                <Form>
                                    <div className="textarea">
                                        <Field className="text-input" type="text" as="textarea" name="description" />
                                        <ErrorMessage name="description" className="error-label" component="div" />
                                        <span className="floating-label">Description</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" name="amount" />
                                        <ErrorMessage name="amount" className="error-label" component="div" />
                                        <span className="floating-label active-label">Amount</span>
                                    </div>
                                    <button ref={this.sendButton} type="submit" style={{ display: "none" }}></button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="block inventory-history">
                    <h3>History</h3>
                    <div className="table-scroll">
                        {this.state.pageData.map((o, i) =>
                            <ul className="history-item" key={i} onMouseDown={this.handleDrag}>
                                <li>Descriptions</li>
                                <li>Count</li>
                                <li>Date</li>
                                <li>Action</li>
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
            </div>
        );
    }
}

class SelectAmount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 0,
        }
    }

    result = (action) => {
        if (this.state.amount > this.props.max || this.state.amount < 0)
            return;
        this.props.callback(this.state.amount, action);
    }

    render() {
        return (
            <li className="amount-input">
                <FontAwesomeIcon className="green" onClick={() => this.result(true)} icon={faChevronCircleUp} />
                <Formik
                    initialValues={{ description: "", amount: 0 }}
                    validate={async values => {
                        const errors = {};

                        if (!values.amount) {
                            errors.amount = 'Required';
                        } else if (parseInt(values.amount) > this.props.max) {
                            errors.amount = 'Big';
                        } else if (parseInt(values.amount) < 0) {
                            errors.amount = 'Negative';
                        }

                        if (!errors.amount) {
                            this.setState({ amount: values.amount });
                        } else {
                            this.setState({ amount: 0 });
                        }

                        return errors;
                    }}
                >
                    {() => (
                        <Form>
                            <div>
                                <Field className="text-input" type="number" name="amount" />
                                <ErrorMessage name="amount" className="error-label" component="div" />
                                <span className="floating-label active-label">Amount</span>
                            </div>
                        </Form>
                    )}
                </Formik>
                <FontAwesomeIcon className="red" onClick={() => this.result(false)} icon={faChevronCircleDown} />
            </li>
        )
    }
}

export default Inventory;