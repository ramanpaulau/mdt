import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios';

const VEHICLES_ON_PAGE = 3;

class Vehicles extends React.Component {


    emptyCar = { vin: 0, plateNum: "", name: "", price: 0 };

    constructor(props) {
        super(props);

        this.state = {
            pageData: [],
            cars: [],
            offset: 0,
            selectedIdx: -1,
            selectedPage: 0,
            pageCount: 0
        };

        this.sendButton = React.createRef();
    }

    loadPages = () => {
        this.setState({
            pageData: this.state.cars.slice(this.state.offset, this.state.offset + VEHICLES_ON_PAGE),
            pageCount: Math.ceil(this.state.cars.length / VEHICLES_ON_PAGE)
        });
    }

    loadCars = async () => {
        await axios.get("http://localhost:8081/vehicles").then(res => {
            this.setState({
                cars: res.data
            }, () => this.loadPages());
        });
    }

    componentDidMount = () => {
        this.loadCars();
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

    render() {
        return (
            <div className="cars">
                <div className="block car-list">
                    <h3>Cars</h3>
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
                                    onClick={() => this.setState({ selectedIdx: i + this.state.selectedPage * VEHICLES_ON_PAGE, password: "" })}>
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
                        <h3 onClick={(this.state.selectedIdx === -1)?() => { this.sendCar() }:() => {}}>Send</h3>
                    </div>
                    <div className="table-scroll">
                        <Formik
                            initialValues={(this.state.selectedIdx === -1) ? this.emptyCar : this.state.cars[this.state.selectedIdx]}
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
                                            this.setState({ cars: [...this.state.cars, tmp] }, () => this.loadPages());
                                        else
                                            console.log(res.data.message);
                                    });
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div>
                                        <Field className="text-input" type="text" disabled={(this.state.selectedIdx === -1)?false:true} style={{ textTransform: "capitalize" }} name="name" />
                                        <ErrorMessage name="name" className="error-label" component="div" />
                                        <span className="floating-label">Model name</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="text" disabled={(this.state.selectedIdx === -1)?false:true} style={{ textTransform: "capitalize" }} name="plateNum" />
                                        <ErrorMessage name="plateNum" className="error-label" component="div" />
                                        <span className="floating-label">Plate number</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" disabled={(this.state.selectedIdx === -1)?false:true} name="vin" />
                                        <ErrorMessage name="vin" className="error-label" component="div" />
                                        <span className="floating-label">VIN</span>
                                    </div>
                                    <div>
                                        <Field className="text-input" type="number" disabled={(this.state.selectedIdx === -1)?false:true} name="price" />
                                        <ErrorMessage name="price" className="error-label" component="div" />
                                        <span className="floating-label">Price</span>
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

export default Vehicles;