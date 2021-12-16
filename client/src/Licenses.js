import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Translation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

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
                    data: firstResponse.data.map(e => { return { ...e, type: "License" } }).concat(secondResponse.data.map(e => { return { ...e, type: "Qualification" } })).sort((a, b) =>
                        (a.name > b.name) ? 1 : -1
                    )
                })
            ));
    }

    render() {
        return (
            <div className="license">
                <div className="block license-list">
                    <Translation>
                        {
                            t => <h3>{t('Title Licenses')}</h3>
                        }
                    </Translation>
                    <div className="table-scroll">
                        <ul className="license-add">
                            <Translation>
                                {
                                    t =>
                                        <Formik
                                            initialValues={{
                                                name: '',
                                                description: '',
                                                type: '',
                                            }}
                                            enableReinitialize={true}
                                            validate={async values => {
                                                const errors = {};

                                                if (!values.name) {
                                                    errors.name = t('Required');
                                                } else if (!/^[A-Za-z ]{2,}$/i.test(values.name)) {
                                                    errors.name = t('Invalid Format');
                                                }

                                                if (!values.description) {
                                                    errors.description = t('Required');
                                                } else if (!/^[A-Za-z ]{2,}$/i.test(values.description)) {
                                                    errors.description = t('Invalid Format');
                                                }

                                                if (!values.type) {
                                                    errors.type = t('Required');
                                                }

                                                return errors;
                                            }}
                                            onSubmit={async (values) => {
                                                let tmp = {
                                                    name: values.name.toUpperCase(),
                                                    description: values.description
                                                }
                                                if (values.type === "license") {
                                                    await axios.post("http://localhost:8081/license", tmp).then(res => {
                                                        if (!res.data.success)
                                                            alert(res.data.message);
                                                        else
                                                            this.loadData();
                                                    });
                                                }

                                                if (values.type === "qualification") {
                                                    await axios.post("http://localhost:8081/qualification", tmp).then(res => {
                                                        if (!res.data.success)
                                                            alert(res.data.message);
                                                        else
                                                            this.loadData();
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
                                                            <span className="floating-label">
                                                                <Translation>
                                                                    {
                                                                        t => t('Form Name')
                                                                    }
                                                                </Translation>
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li className="type">
                                                        <div>
                                                            <label>
                                                                <Field type="radio" name="type" value="license" />
                                                                <Translation>
                                                                    {
                                                                        t => t('License')
                                                                    }
                                                                </Translation>
                                                            </label>
                                                            <label>
                                                                <Field type="radio" name="type" value="qualification" />
                                                                <Translation>
                                                                    {
                                                                        t => t('Qualification')
                                                                    }
                                                                </Translation>
                                                            </label>
                                                        </div>
                                                        <ErrorMessage name="type" className="error-text" component="div" />
                                                    </li>
                                                    <li className="description">
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
                                                    </li>
                                                    <li className="button">
                                                        <button ref={this.sendButton} className="round-link" type="submit">
                                                            <Translation>
                                                                {
                                                                    t => t('Title Send')
                                                                }
                                                            </Translation>
                                                        </button>
                                                    </li>
                                                </Form>
                                            )}
                                        </Formik>
                                }
                            </Translation>
                        </ul>
                        {this.state.data.map((e, i) =>
                            <ul key={i} className="license-item">
                                <li className="name">
                                    {e.name}
                                </li>
                                <li className="description">
                                    {e.details}
                                </li>
                                <li className="type">
                                    {(e.type === "License") ?
                                        <Translation>
                                            {
                                                t => t('License')
                                            }
                                        </Translation>
                                        :
                                        <Translation>
                                            {
                                                t => t('Qualification')
                                            }
                                        </Translation>}
                                </li>
                                <li className="button">
                                    <span className="link-button" onClick={async () => {
                                        let tmp = (e.type === "License") ? "license" : "qualification";
                                        await axios.delete("http://localhost:8081/" + tmp + "/" + e.id).then(res => {
                                            if (!res.data.success)
                                                alert(res.data.message);
                                            else
                                                this.loadData();
                                        });
                                    }}>
                                        <FontAwesomeIcon icon={faTimesCircle} />
                                    </span>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Licenses;