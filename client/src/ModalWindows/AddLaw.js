import React from "react";
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from "formik";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#2551A8',
        color: '#FFFFFF'
    }
};

class AddChapter extends React.Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div>
                <FontAwesomeIcon icon={faPlus} onClick={this.handleOpenModal} />
                <ReactModal
                    isOpen={this.state.showModal}
                    ariaHideApp={false}
                    contentLabel="Add sub/chapter"
                    style={customStyles}
                >
                    <Formik
                        initialValues={{
                            text: "",
                            fine: 0,
                            detention: 0
                        }}
                        enableReinitialize={true}
                        validate={async values => {
                            const errors = {};
                            if (!values.text) {
                                errors.text = 'Required';
                            }

                            if (parseInt(values.detention) < 0 || 2147483647 < parseInt(values.fine)) {
                                errors.fine = 'Must be in range [0, 2.147.483.647]';
                            }

                            if (parseInt(values.detention) < 0 || 2147483647 < parseInt(values.detention)) {
                                errors.detention = 'Must be in range [0, 2.147.483.647]';
                            }

                            return errors;
                        }}
                        onSubmit={async (values) => {
                            this.props.callback(values.text.charAt(0).toUpperCase() + values.text.slice(1), values.fine, values.detention);
                            this.handleCloseModal();
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div>
                                    <Field className="text-input" type="text" name="text" />
                                    <ErrorMessage name="text" className="error-label" component="div" />
                                    <span className="floating-label">Text</span>
                                </div>
                                <div>
                                    <Field className="text-input" type="number" name="fine" />
                                    <ErrorMessage name="fine" className="error-label" component="div" />
                                    <span className="floating-label active-label">Fine</span>
                                </div>
                                <div>
                                    <Field className="text-input" type="number" name="detention" />
                                    <ErrorMessage name="detention" className="error-label" component="div" />
                                    <span className="floating-label active-label">Detention</span>
                                </div>
                                <button className="round-link" type="submit"><FontAwesomeIcon icon={faPlus} /></button>
                            </Form>
                        )}
                    </Formik>
                    <div className="close-modal">
                        <FontAwesomeIcon className="close" icon={faTimesCircle} onClick={this.handleCloseModal} />
                    </div>
                </ReactModal>
            </div>
        );
    }
}

export default AddChapter;