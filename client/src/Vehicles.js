import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimesCircle, faSave } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios';
import Select from 'react-select';
import { customStyles } from "./Employees";

const VEHICLES_ON_PAGE = 3;

class Vehicles extends React.Component {


    emptyCar = { vin: 0, plateNum: "", name: "", price: 0 };

    constructor(props) {
        super(props);

        this.state = {
            pageData: [],
            vehicles: [],
            departments: [],
            offset: 0,
            selectedIdx: -1,
            selectedPage: 0,
            pageCount: 0
        };

        this.sendButton = React.createRef();
    }

    loadPages = () => {
        this.setState({
            pageData: this.state.vehicles.slice(this.state.offset, this.state.offset + VEHICLES_ON_PAGE),
            pageCount: Math.ceil(this.state.vehicles.length / VEHICLES_ON_PAGE)
        });
    }

    /*loadCars = async () => {
        await axios.get("http://localhost:8081/vehicles").then(res => {
            this.setState({
                cars: res.data
            }, () => this.loadPages());
        });
    }*/


    loadData = async () => {
        await axios.all([
            axios.get("http://localhost:8081/vehicles"),
            axios.get("http://localhost:8081/departments")])
            .then(axios.spread((firstResponse, secondResponse) => {
                this.setState({
                    vehicles: firstResponse.data,
                    departments: secondResponse.data
                }, () => this.loadPages())
            })
            )
            .catch(error => console.log(error));
    }

    componentDidMount = () => {
        this.loadData();
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * VEHICLES_ON_PAGE);

        this.setState({ offset: offset, selectedPage: selected }, () => {
            this.loadPages();
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

    sendCar = () => {
        if (this.sendButton.current)
            this.sendButton.current.click();
    }

    sendDepartment = async () => {
        if (!this.state.department)
            return;
        let vin = this.state.vehicles[this.state.selectedIdx].vin;
        await axios.post("http://localhost:8081/vehicle/" + vin + "/confiscate/" + this.state.department).then(async res => {
            if (!res.data.success)
                console.log(res.data.message);
            await axios.get("http://localhost:8081/vehicles").then(res => {
                this.setState({
                    vehicles: res.data
                })
            });
        });
    }

    deleteDepartment = async () => {
        let vin = this.state.vehicles[this.state.selectedIdx].vin;
        await axios.post("http://localhost:8081/vehicle/" + vin + "/confiscate/remove").then(async res => {
            if (!res.data.success)
                console.log(res.data.message);
            await axios.get("http://localhost:8081/vehicles").then(res => {
                this.setState({
                    vehicles: res.data
                })
            });
        });
    }

    render() {
        return (
            <div className="cars">
                <div className="block car-list">
                    <h3>Vehicles</h3>
                    <div className="table-scroll">
                        {this.state.pageData.map((c, i) =>
                            <ul className="car-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="vin">{c.vin}</li>
                                <li className="name">{c.name}</li>
                                <li className="plateNum">{c.plateNum}</li>
                                <li className="price">{c.price}$</li>
                                <Link
                                    to={"/vehicles/" + (c.plateNum)}
                                    className="edit-button round-link"
                                    onClick={() => this.setState({ selectedIdx: i + this.state.selectedPage * VEHICLES_ON_PAGE, department: this.state.vehicles[i + this.state.selectedPage * VEHICLES_ON_PAGE].department })}>
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
                <div className="block car-editor">
                    <div className="title">
                        <h3>
                            <Link
                                to={"/vehicles"}
                                className="link"
                                onClick={() => { this.setState({ selectedIdx: -1 }); }}>
                                New
                            </Link>
                        </h3>
                        <h3 onClick={(this.state.selectedIdx === -1) ? () => { this.sendCar() } : () => { }}>Send</h3>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={(this.state.selectedIdx === -1) ? this.emptyCar : this.state.vehicles[this.state.selectedIdx]}
                            enableReinitialize={true}
                            validate={async values => {
                                const errors = {};
                                if (!values.name) {
                                    errors.name = 'Required';
                                } else if (!/^[A-Za-z ]{2,}$/i.test(values.name)) {
                                    errors.name = 'Invalid name';
                                }

                                if (!values.plateNum) {
                                    errors.plateNum = 'Required';
                                } else if (!/^[A-Z0-9]{4}$/i.test(values.plateNum)) {
                                    errors.plateNum = 'Invalid plate number';
                                } else {
                                    await axios.get("http://localhost:8081/vehicles/is_plateNum_available/" + values.plateNum.toUpperCase()).then((res) => {
                                        if (!res.data.success)
                                            errors.plateNum = 'Occupied';
                                    });
                                }

                                if (!values.vin) {
                                    errors.vin = 'Required';
                                } else if (!/^[0-9]{6}$/i.test(values.vin)) {
                                    errors.vin = 'Format: six numbers';
                                } else {
                                    await axios.get("http://localhost:8081/vehicles/is_vin_available/" + values.vin).then((res) => {
                                        if (!res.data.success)
                                            errors.vin = 'Occupied';
                                    });
                                }

                                return errors;
                            }}
                            onSubmit={async (values) => {
                                let tmp = {
                                    plateNum: values.plateNum.toUpperCase(),
                                    vin: values.vin,
                                    name: values.name.charAt(0).toUpperCase() + values.name.slice(1),
                                    price: values.price
                                };
                                await axios.post("http://localhost:8081/vehicle", tmp)
                                    .then((res) => {
                                        if (res.data.success)
                                            this.setState({ cars: [...this.state.vehicles, tmp] }, () => this.loadPages());
                                        else
                                            console.log(res.data.message);
                                    });
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div>
                                        <Field className="text-input" type="text" disabled={(this.state.selectedIdx === -1) ? false : true} style={{ textTransform: "capitalize" }} name="name" />
                                        <ErrorMessage name="name" className="error-label" component="div" />
                                        <span className="floating-label">Model name</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="text" disabled={(this.state.selectedIdx === -1) ? false : true} style={{ textTransform: "capitalize" }} name="plateNum" />
                                        <ErrorMessage name="plateNum" className="error-label" component="div" />
                                        <span className="floating-label">Plate number</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" disabled={(this.state.selectedIdx === -1) ? false : true} name="vin" />
                                        <ErrorMessage name="vin" className="error-label" component="div" />
                                        <span className="floating-label">VIN</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" disabled={(this.state.selectedIdx === -1) ? false : true} name="price" />
                                        <ErrorMessage name="price" className="error-label" component="div" />
                                        <span className="floating-label">Price</span>
                                    </div>
                                    {(this.state.selectedIdx !== -1) ?
                                        <div className="edit-list department" style={{ display: "flex", flexDirection: "column" }}>
                                            <p className="text-label">Confiscated: </p>
                                            <Select styles={{ ...customStyles, container: (provided) => ({ ...provided, width: "224px" }) }}
                                                options={this.state.departments.map(d => (
                                                    {
                                                        value: d.code,
                                                        label: d.shortTitle
                                                    })
                                                )}
                                                onChange={(e) => { this.setState({ department: e.value }) }}
                                                value={(this.state.departments.filter(d => d.code === this.state.department)[0]) ? { value: this.state.department, label: this.state.departments.filter(d => d.code === this.state.department)[0].shortTitle } : {}}
                                                placeholder="Department"
                                                noOptionsMessage={() => "Not found"} />
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); this.sendDepartment(); }}>
                                                <FontAwesomeIcon icon={faSave} />
                                            </span>
                                            <span className="link-button" onClick={(e) => { e.preventDefault(); this.deleteDepartment(); }}>
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </span>
                                        </div> : ""}
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

export default Vehicles;