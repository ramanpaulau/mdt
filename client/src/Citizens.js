import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus, faSave, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SelectSearch from 'react-select-search';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CALLS_ON_PAGE = 3;

class Citizens extends React.Component {

    users = [
        {id: 1, regnum: "32KL", name: "John", surname: "Pike", phone: "438-5217", state: "alive"},
        {id: 2, regnum: "32KL", name: "John", surname: "Pike", phone: "438-5217", state: "dead"},
        {id: 3, regnum: "32KL", name: "John", surname: "Pike", phone: "438-5217", state: "alive"},
        {id: 4, regnum: "32KL", name: "John", surname: "Pike", phone: "438-5217", state: "alive"},
        {id: 5, regnum: "32KL", name: "John", surname: "Pike", phone: "438-5217", state: "alive"},
        {id: 6, regnum: "32KL", name: "John", surname: "Pike", phone: "438-5217", state: "alive"},
        {id: 7, regnum: "32KL", name: "John", surname: "Pike", phone: "438-5217", state: "alive"},
        {id: 8, regnum: "32KL", name: "John", surname: "Pike", phone: "438-5217", state: "alive"}
    ];

    states = ["alive", "dead", "missing"];

    licenseIds = [
        { name: "1", value: 1},
        { name: "2", value: 2},
        { name: "3", value: 3},
        { name: "4", value: 4}
    ];

    emptyUser = {id: "", name: "", surname: "", phone: "", regnum: ""};

    constructor(props) {
        super(props);

        let id = this.props.match.params.id;

        if (id === undefined)
            id = 0;

        let selectedUser = (id === 0)?this.emptyUser:this.users[id];

        this.state = {
            data: [],
            offset: 0,
            selectedUser: selectedUser,
            birthDate: new Date(),
            pageCount: 0
        };
    }

    loadCalls = () => {
        this.setState({
            data: this.users.slice(this.state.offset, this.state.offset + CALLS_ON_PAGE),
            pageCount: Math.ceil(this.users.length / CALLS_ON_PAGE)
        });
      }

    componentDidMount = () => {
        this.loadCalls();
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * CALLS_ON_PAGE);
    
        this.setState({ offset: offset, selected: selected }, () => {
          this.loadCalls();
        });
      };

    selectCall = (id) => {
        this.setState({ selectedUser: this.users[id] });
    }

    handleTextarea = (event) => {
        let tmp = this.state.selectedCall;
        tmp.description = event.target.value;
        this.setState({ selectCall: tmp });
    }

    removeLicense = (id) => {
        alert(id);
    }

    optionsSearch = () => {
        return (v) => {
            return this.licenseIds.filter((e) => e.name.toLowerCase().startsWith(v.toLowerCase()));
        };
    }

    render() {
        return(
            <div className="citizens">
                <div className="block citizen-list">
                    <h3>Citizens</h3>
                    <div className="table-scroll"> 
                        {this.state.data.map((o, i) =>
                            <ul className="citizen" key={i} onMouseDown={this.handleDrag}>
                                <Link 
                                    to={"/citizens/" + o.id}
                                    className="edit-button round-link"
                                    onClick={() => this.selectCall(o.id)}>
                                    View
                                </Link>
                                
                                <li className="regnum">{o.regnum}</li>
                                <li className="fullname">{o.name + " " + o.surname}</li>
                                <li className="phone">Phone: {o.phone}</li>
                            </ul>
                        )}
                    </div>
                        <ReactPaginate
                            previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                            nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                            breakLabel="..."
                            breakClassName="break-me"
                            pageCount={this.state.pageCount}
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
                <div className="block citizen-editor">
                    <div className="title">
                        <h3>
                            <Link 
                            to={"/citizens"} 
                            className="link"
                            onClick={() => { this.setState({ selectedUser: this.emptyUser }); }}>
                                New
                            </Link>
                        </h3>
                        <h3>Send</h3>
                    </div>
                    <div className="table-scroll"> 
                        <form>
                            <div>
                                <input type="text" className="text-input" required value={(this.state.selectedUser.id !== "")?this.state.selectedUser.name + " " + this.state.selectedUser.surname:""} onChange={() => {}} />
                                <span className="floating-label">Name</span>
                            </div>
                            
                            <div>
                                <input type="text" className="text-input" required value={(this.state.selectedUser.id !== "")?this.state.selectedUser.name + " " + this.state.selectedUser.surname:""} onChange={() => {}} />
                                <span className="floating-label">Surname</span>
                            </div>

                            <div>
                                <input type="text" className="text-input" required value={this.state.selectedUser.phone} onChange={() => {}} />
                                <span className="floating-label">Phone</span>
                            </div>

                            <div>
                                <DatePicker className="datePicker" selected={this.state.birthDate} onChange={(date) => this.setState({ birthDate: date })} />
                                <span className="floating-label active-label">Birth date</span>
                            </div>

                            <div>
                                <input type="text" className="text-input" required value={this.state.selectedUser.regnum} onChange={() => {}} />
                                <span className="floating-label">Registration number</span>
                            </div>

                            <div>
                                <select>
                                    {this.states.map(e => <option value={e} key={e}>{e.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="block citizen-info">
                    <div className="table-scroll">
                        <div className="edit-list licenses">
                            <p className="text-label">Licenses: </p>
                            <Link 
                                to={"/license?id=3"} 
                                className="round-link">
                                    #3
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                            <div className="report-controls">
                                <SelectSearch options={this.licenseIds} search filterOptions={this.optionsSearch} emptyMessage="Not found" placeholder="License ID" />
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faSave} />
                                </span>
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </div>
                        </div>
                        
                        <div className="edit-list property">
                            <p className="text-label">Property: </p>
                            <Link 
                                to={"/property?id=3"} 
                                className="round-link">
                                    #3
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                            <div className="report-controls">
                                <SelectSearch options={this.reportIds} search filterOptions={this.optionsSearch} emptyMessage="Not found" placeholder="Property ID" />
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faSave} />
                                </span>
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </div>
                        </div>
                        
                        <div className="edit-list transport">
                            <p className="text-label">Transport: </p>
                            <Link 
                                to={"/transport?id=3"} 
                                className="round-link">
                                    #3
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                            <div className="report-controls">
                                <SelectSearch options={this.reportIds} search filterOptions={this.optionsSearch} emptyMessage="Not found" placeholder="Transport ID" />
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faSave} />
                                </span>
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </div>
                        </div>

                        <div className="edit-list incidents">
                            <p className="text-label">Related incidents: </p>
                            <Link 
                                to={"/incident?id=3"} 
                                className="round-link">
                                    #3
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                        </div>

                        <div className="edit-list criminal">
                            <p className="text-label">Criminal records: </p>
                            <Link 
                                to={"/records?id=3"} 
                                className="round-link">
                                    #3
                                <span className="link-button" onClick={(e) => {e.preventDefault(); }}>
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Citizens;