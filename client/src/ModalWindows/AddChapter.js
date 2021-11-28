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
            <div className="chapter">
                <FontAwesomeIcon icon={faPlus} onClick={this.handleOpenModal} />
                <ReactModal
                    isOpen={this.state.showModal}
                    ariaHideApp={false}
                    contentLabel="Add sub/chapter"
                    style={customStyles}
                >
                    <Formik
                        initialValues={{
                            title: ""
                        }}
                        enableReinitialize={true}
                        validate={async values => {
                            const errors = {};
                            if (!values.title) {
                                errors.title = 'Required';
                            }
                            return errors;
                        }}
                        onSubmit={async (values) => {
                            this.props.callback(values.title.charAt(0).toUpperCase() + values.title.slice(1));
                            this.handleCloseModal();
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div>
                                    <Field className="text-input" type="text" name="title" />
                                    <ErrorMessage name="title" className="error-label" component="div" />
                                    <span className="floating-label">Title</span>
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