import React from "react";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlus, faSave, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SelectSearch from 'react-select-search';

const CALLS_ON_PAGE = 20;

class Calls extends React.Component {

    calls = [
        { id: 1, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 2, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 3, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 4, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 5, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 6, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 7, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 8, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 9, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 10, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 11, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 12, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 13, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 14, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 15, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 16, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 17, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 18, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 19, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 20, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 21, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 22, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 23, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 24, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 25, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 26, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 27, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 28, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 29, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 30, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 31, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 32, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 33, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 34, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 35, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 36, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 37, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 38, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 39, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" },
        { id: 40, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 41, time: "20:22", location: "Route 1", phone: "431-4578", description: "Speeding", officers: "3-TM-11" },
        { id: 42, time: "20:46", location: 7893, phone: "458-4567", description: "Central bank robbery", officers: "-" },
        { id: 43, time: "20:15", location: 3547, phone: "anonymous", description: "Murder near central mall", officers: "1-LN-15, 1-LN-22" }
    ];

    reportIds = [
        { name: "1", value: 1 },
        { name: "2", value: 2 },
        { name: "3", value: 3 },
        { name: "4", value: 4 }
    ];

    tag = "2-RM-5";

    emptyCall = { id: "", time: "", location: "", phone: "", description: "", officers: "" };

    constructor(props) {
        super(props);

        let id = this.props.match.params.id;

        if (id === undefined)
            id = 0;

        let selectedCall = (id === 0) ? this.emptyCall : this.calls[id];

        this.state = {
            data: [],
            offset: 0,
            selectedCall: selectedCall,
            pageCount: 0
        };
    }

    loadCalls = () => {
        this.setState({
            data: this.calls.slice(this.state.offset, this.state.offset + CALLS_ON_PAGE),
            pageCount: Math.ceil(this.calls.length / CALLS_ON_PAGE)
        });
    }

    componentDidMount = () => {
        this.props.clearNots("calls");
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
        this.setState({ selectedCall: this.calls[id] });
    }

    handleTextarea = (event) => {
        let tmp = this.state.selectedCall;
        tmp.description = event.target.value;
        this.setState({ selectCall: tmp });
    }

    removeReport = (id) => {
        alert(id);
    }

    optionsSearch = () => {
        return (v) => {
            return this.reportIds.filter((e) => e.name.toLowerCase().startsWith(v.toLowerCase()));
        };
    }

    render() {
        return (
            <div className="calls">
                {((this.props.store.employeeId) || (this.props.store.admin)) ?
                    <div className="block calls-list">
                        <h3>ACTIVE CALLS</h3>
                        <div className="table-scroll">
                            {this.state.data.map((o, i) =>
                                <ul className="call-item" key={i} onMouseDown={this.handleDrag}>
                                    <li className="call-location">Location: {o.location}</li>
                                    <li className="call-id">#{o.id}</li>
                                    <li className="call-time">Time: {o.time}</li>
                                    <li></li>
                                    <li className="call-phone">Phone: {o.phone}</li>
                                    <Link
                                        to={"/calls/" + o.id}
                                        className="edit-button round-link"
                                        onClick={() => this.selectCall(o.id)}>
                                        Edit
                                    </Link>
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
                    : ""}
                <div className="block calls-editor">
                    <div className="title">
                        <h3>
                            <Link
                                to={"/calls"}
                                className="link"
                                onClick={() => { this.setState({ selectedCall: this.emptyCall }); }}>
                                New
                            </Link>
                        </h3>
                        <h3>Send</h3>
                    </div>
                    <div className="table-scroll">
                        <form>
                            <div>
                                <span className="floating-label">{(this.state.selectedCall.id !== "") ? '#' + this.state.selectedCall.id : ""}</span>
                            </div>

                            <div>
                                <input type="text" className="text-input" required value={this.state.selectedCall.time} onChange={() => { }} />
                                <span className="floating-label">Time of call</span>
                            </div>

                            <div>
                                <input type="text" className="text-input" required value={this.state.selectedCall.location} onChange={() => { }} />
                                <span className="floating-label">Location</span>
                            </div>
                            <div>
                                <input type="text" className="text-input" required value={this.state.selectedCall.phone} onChange={() => { }} />
                                <span className="floating-label">Phone</span>
                            </div>

                            <textarea value={this.state.selectedCall.description} onChange={() => { }} />

                            <div className="edit-list officers">
                                <p className="text-label">Officers: </p>
                                <Link
                                    to={"/officers?tag=1-LN-20"}
                                    className="round-link">
                                    1-LN-20
                                </Link>
                                <Link
                                    to={"/officers?tag=1-LN-11"}
                                    className="round-link">
                                    1-LN-11
                                </Link>
                                <Link
                                    to={"/officers?tag=" + this.tag}
                                    className="round-link">
                                    {this.tag}
                                </Link>
                            </div>

                            <div className="edit-list report">
                                <p className="text-label">Report: </p>
                                <Link
                                    to={"/report?id=51"}
                                    className="round-link">
                                    #51
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); this.removeReport(51); }}>
                                        <FontAwesomeIcon icon={faTimesCircle} />
                                    </span>
                                </Link>
                                <div className="report-controls">
                                    <SelectSearch options={this.reportIds} search filterOptions={this.optionsSearch} emptyMessage="Not found" placeholder="Report ID" />
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                        <FontAwesomeIcon icon={faSave} />
                                    </span>
                                    <span className="link-button" onClick={(e) => { e.preventDefault(); }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Calls;