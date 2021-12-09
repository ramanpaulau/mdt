import React from "react";
import ReactModal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Translation } from 'react-i18next';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        height: '500px',
        width: '800px',
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
            selectedLaws: [],
            penalCode: [],
            showModal: false,
            filterStr: ""
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentDidMount = () => {
        this.loadPenalCode();
    }

    loadPenalCode = async () => {
        await axios.get("http://localhost:8081/penal-code").then((res) => {
            let penalCode = [];
            res.data.map(c =>
                c.subchapters.map(s =>
                    s.laws.map(l =>
                        penalCode.push({
                            number: c.number + "." + s.number + "." + l.number,
                            text: l.text,
                            detention: l.detention,
                            fine: l.fine
                        })
                    )
                )
            );

            this.setState({ penalCode: penalCode });
        });
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.props.callback(this.state.selectedLaws);
        this.setState({ showModal: false });
    }

    render() {
        let filteredPenalCode = this.state.penalCode.filter(l => l.text.toLowerCase().includes(this.state.filterStr.toLowerCase()));
        return (
            <div>
                <span onClick={this.handleOpenModal} className="round-link" >
                    <Translation>
                        {
                            t => t('Button Laws')
                        }
                    </Translation>
                </span>
                <ReactModal
                    isOpen={this.state.showModal}
                    ariaHideApp={false}
                    contentLabel="Add sub/chapter"
                    style={customStyles}
                >
                    <div className="close-modal">
                        <input type="text" className="text-input" value={this.state.filterStr} onChange={(e) => this.setState({ filterStr: e.target.value })} />
                        <FontAwesomeIcon className="close" icon={faTimesCircle} onClick={this.handleCloseModal} />
                    </div>
                    <div>
                        {filteredPenalCode.map(l =>
                            <ul key={l.number} style={{ display: "flex", gap: "10px" }} >
                                <li><input type="checkbox" onClick={() => {
                                    if (this.state.selectedLaws.includes(l))
                                        this.setState({ selectedLaws: this.state.selectedLaws.filter(v => v !== l) });
                                    else
                                        this.setState({ selectedLaws: [...this.state.selectedLaws, l] });
                                }} defaultChecked={this.state.selectedLaws.includes(l)} /></li>
                                <li>{l.number}</li>
                                <li>{l.text}</li>
                            </ul>
                        )}
                    </div>
                </ReactModal>
            </div>
        );
    }
}

export default AddChapter;