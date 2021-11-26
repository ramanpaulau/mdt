import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

class Licenses extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentDidMount = () => {
        this.loadData();
    }

    loadData = async () => {
        await axios.all([
            axios.get("http://localhost:8081/licenses"),
            axios.get("http://localhost:8081/qualifications")])
            .then(axios.spread((firstResponse, secondResponse) =>
                this.setState({
                    data: firstResponse.data.map(e => {return {...e, type: "License"}}).concat(secondResponse.data.map(e => {return {...e, type: "Qualification"}})).sort((a, b) =>
                        (a.name > b.name) ? 1 : -1
                    )
                })
            ));
    }

    render() {
        return (
            <div className="license">
                <div className="block license-list">
                    <h3>Licenses</h3>
                    <div className="table-scroll">
                        <ul className="license-item license-add">
                            <Formik
                                initialValues={{
                                    type: '',
                                }}
                                enableReinitialize={true}
                                validate={async values => {
                                    const errors = {};
                                    return errors;
                                }}
                                onSubmit={async (values) => {
                                    let tmp = {
                                        name: values.name,
                                        description: values.description
                                    }
                                    if (values.type === "license") {
                                        await axios.post("http://localhost:8081/license", tmp).then(res => {
                                            if (!res.data.success)
                                                console.log(res.data.message);
                                        });
                                    }

                                    if (values.type === "qualification") {
                                        await axios.post("http://localhost:8081/qualification", tmp).then(res => {
                                            if (!res.data.success)
                                                console.log(res.data.message);
                                        });
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <li className="name">
                                            <div>
                                                <Field className="text-input" type="text" style={{ textTransform: "uppercase" }} name="name" />
                                                <ErrorMessage name="name" className="error-label" component="div" />
                                                <span className="floating-label">Name</span>
                                            </div>
                                        </li>
                                        <li className="description">
                                            <div>
                                                <Field className="text-input" type="text" name="description" />
                                                <ErrorMessage name="description" className="error-label" component="div" />
                                                <span className="floating-label active-label">Description</span>
                                            </div>
                                        </li>
                                        <li className="type">
                                            <label>
                                                <Field type="radio" name="type" value="license" />
                                                License
                                            </label>
                                            <label>
                                                <Field type="radio" name="type" value="qualification" />
                                                Qualification
                                            </label>
                                        </li>
                                        <li className="button">
                                            <button ref={this.sendButton} className="round-link" type="submit">Send</button>
                                        </li>
                                    </Form>
                                )}
                            </Formik>
                        </ul>
                        {this.state.data.map((e, i) =>
                            <ul key={i} className="license-item">
                                <Formik
                                    onSubmit={async (values) => {
                                    }}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <li className="name">
                                                {e.name}
                                            </li>
                                            <li className="description">
                                                {e.details}
                                            </li>
                                            <li className="type">
                                                {e.type}
                                            </li>
                                            <li className="button">
                                                <button ref={this.sendButton} className="round-link" type="submit">Delete</button>
                                            </li>
                                        </Form>
                                    )}
                                </Formik>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Licenses;