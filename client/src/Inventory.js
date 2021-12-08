import React from "react";
import Select from 'react-select'
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { user } from './auth/User';
import { customStyles } from './Employees';
import { Translation } from 'react-i18next';

const HISTORY_ON_PAGE = 6;

class Inventory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            departments: [],
            inventory: [],
            history: [],
            pageData: [],
            description: "",
            department: 0,
            amount: 0,
            offset: 0,
            selectedPage: 0,
            pageCount: 0
        }

        this.sendButton = React.createRef();
    }

    componentDidMount = async () => {
        this.loadDepartments();
        this.loadInventory();
        this.loadHistory();
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

    clearForm = async () => {
    }

    sendItem = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    loadHistory = async () => {
        await axios.get("http://localhost:8081/history").then(res => {
            this.setState({
                history: res.data
            }, () => this.getPageData());
        });
    }

    getPageData = () => {
        this.setState({
            pageData: this.state.history.slice(this.state.offset, this.state.offset + HISTORY_ON_PAGE),
            pageCount: Math.ceil(this.state.history.length / HISTORY_ON_PAGE)
        });
    }

    proceedAction = async (description, amount, action) => {
        if (!amount)
            return;

        let tmp = {
            employee: user.employeeId,
            description: description,
            amount: amount,
            action: action,
            department: this.state.department
        }

        console.log(tmp);

        await axios.post("http://localhost:8081/history", tmp).then(res => {
            if (!res.data.success)
                console.log(res.data.message);
            else
                this.loadHistory();
        });
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * HISTORY_ON_PAGE);

        this.setState({ offset: offset, selectedPage: selected }, () => {
            this.loadCitizens();
        });
    };

    render() {
        let filteredInventory = this.state.inventory.filter(e => e.department === this.state.department);

        return (
            <div className="inventory">
                <div className="block inventory-list">
                    <div className="title title-select">
                        <Translation>
                            {
                                t => <h3>{t('Title Inventory')}</h3>
                            }
                        </Translation>
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
                                <SelectAmount callback={(amount, action) => {
                                    let newInventory = [...this.state.inventory];
                                    let selected = { ...this.state.inventory[i] };
                                    selected.amount = (action) ? selected.amount + amount : selected.amount - amount;
                                    if (selected.amount > 0)
                                        newInventory[i] = selected;
                                    else
                                        newInventory = this.state.inventory.slice(0, i).concat(this.state.inventory.slice(i + 1));
                                    this.setState({ inventory: newInventory });
                                    this.proceedAction(e.description, amount, action);
                                }} max={e.amount} />
                            </ul>
                        )}
                    </div>
                </div>
                <div className="block inventory-editor">
                    <div className="title">
                        <h3>
                            <Translation>
                                {
                                    t =>
                                        <Link
                                            to={"/inventory"}
                                            className="link"
                                            onClick={() => this.clearForm()}>
                                            {t('Title New')}
                                        </Link>
                                }
                            </Translation>
                        </h3>
                        <Translation>
                            {
                                t => <h3 onClick={() => { this.sendItem() }}>{t('Title Send')}</h3>
                            }
                        </Translation>
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
                    <Translation>
                        {
                            t => <h3>{t('Title History')}</h3>
                        }
                    </Translation>
                    <div className="table-scroll">
                        {this.state.pageData.map((o, i) =>
                            <ul className="history-item" key={i} onMouseDown={this.handleDrag}>
                                <li>{(new Date(o.date)).toLocaleString()}</li>
                                <li>{o.description}</li>
                                <li>*{o.amount}</li>
                                <li>{o.department}</li>
                                <li>{(o.action) ? <FontAwesomeIcon className="green" icon={faChevronCircleUp} /> : <FontAwesomeIcon className="red" icon={faChevronCircleDown} />}</li>
                                <li>{o.employee}</li>
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
        let amount = this.state.amount;
        if (amount < 0)
            return;
        if (!action && amount > this.props.max) {
            amount = this.props.max;
        }
        this.props.callback(amount, action);
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