import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { observer } from "mobx-react";
import moment from "moment";
import { Link } from 'react-router-dom';
import { Translation } from 'react-i18next';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bolo: "cars",
            activeOfficers: []
        };
    }

    componentDidMount = () => {
    }

    sendState = async (state) => {
        let tmp = {
            id: this.props.store.employeeId,
            state: state
        }
        this.props.wsClient.publish({ destination: "/api/employees/state", body: JSON.stringify(tmp) });
    }

    boloClick = (type) => {
        this.setState({ bolo: type });
    }

    render() {
        return (
            <div className="home" onMouseMove={this.handleMove} onMouseUp={this.handleDrop} >
                <div className="block active-bolo">
                    {(this.state.bolo === "cars") &&
                        <div>
                            <ul className="table-head">
                                <li>#</li>
                                <li>
                                    <Translation>
                                        {
                                            t => t('Plate number')
                                        }
                                    </Translation>
                                </li>
                                <li>
                                    <Translation>
                                        {
                                            t => t('Model')
                                        }
                                    </Translation>
                                </li>
                                <li>
                                    <Translation>
                                        {
                                            t => t('Incident')
                                        }
                                    </Translation>
                                </li>
                            </ul>
                        </div>}
                    {(this.state.bolo === "cars") &&
                        <div className="table-scroll">
                            {this.props.boloVehicles.map((o, i) =>
                                <ul className="bolo-item" key={i}>
                                    <li>{i + 1}</li>
                                    <li>{o.record.plateNum}</li>
                                    <li>{o.record.name}</li>
                                    <li>{o.incident.id}</li>
                                </ul>
                            )}
                        </div>}
                    {(this.state.bolo === "persons") &&
                        <div>
                            <ul className="table-head">
                                <li>#</li>
                                <li>ID</li>
                                <li>
                                    <Translation>
                                        {
                                            t => t('Name')
                                        }
                                    </Translation>
                                </li>
                                <li>
                                    <Translation>
                                        {
                                            t => t('Incident')
                                        }
                                    </Translation>
                                </li>
                            </ul>
                        </div>}
                    {(this.state.bolo === "persons") &&
                        <div className="table-scroll">
                            {this.props.boloCitizens.map((o, i) =>
                                <ul className="bolo-item" key={i} onMouseDown={this.handleDrag}>
                                    <li>{i}</li>
                                    <li>{o.record.regNum}</li>
                                    <li>{o.record.fullName}</li>
                                    <li>{o.incident.id}</li>
                                </ul>
                            )}
                        </div>}
                    <div className="title">
                        <Translation>
                            {
                                t => <h3 className="active" onClick={() => this.boloClick("cars")}>{t('Title BOLO Vehicles')}</h3>
                            }
                        </Translation>
                        <Translation>
                            {
                                t => <h3 onClick={() => this.boloClick("persons")}>{t('Title BOLO Citizens')}</h3>
                            }
                        </Translation>
                    </div>
                </div>
                <div className="block active-units">
                    <Translation>
                        {
                            t => <h3>{t('Title Employees')}</h3>
                        }
                    </Translation>
                    <div>
                        <ul className="table-head">
                            <li>#</li>
                            <li>
                                <Translation>
                                    {
                                        t => t('Marking')
                                    }
                                </Translation>
                            </li>
                            <li>
                                <Translation>
                                    {
                                        t => t('Name')
                                    }
                                </Translation>
                            </li>
                            <li>
                                <Translation>
                                    {
                                        t => t('Department')
                                    }
                                </Translation>
                            </li>
                            <li>
                                <Translation>
                                    {
                                        t => t('Rank')
                                    }
                                </Translation>
                            </li>
                            <li>
                                <Translation>
                                    {
                                        t => t('State')
                                    }
                                </Translation>
                            </li>
                        </ul>
                    </div>
                    <div className="table-scroll">
                        {this.props.activeOfficers.map((o, i) =>
                            <ul className="unit-item" key={i} onMouseDown={this.handleDrag}>
                                <li>{i + 1}</li>
                                <li>{o.employee.marking}</li>
                                <li>{o.employee.fullName}</li>
                                <li>{o.employee.departmentTitle}</li>
                                <li>{o.employee.rank}</li>
                                <li>{o.state}</li>
                            </ul>
                        )}
                    </div>
                </div>
                <div className="block active-states">
                    <div className="state-elem" onClick={() => { this.sendState("10-2"); }} ><p>10-2</p></div>
                    <div className="state-elem" onClick={() => { this.sendState("10-7"); }} ><p>10-7</p></div>
                    <div className="state-elem" onClick={() => { this.sendState("10-8"); }} ><p>10-8</p></div>
                    <div className="state-elem" onClick={() => { this.sendState("10-9"); }} ><p>10-9</p></div>
                    <div className="state-elem" onClick={() => { this.sendState("10-14"); }} ><p>10-14</p></div>
                    <div className="state-elem" onClick={() => { this.sendState("10-48"); }} ><p>10-48</p></div>
                    <div className="state-elem" onClick={async () => {
                        let tmp = {
                            eid: this.props.store.employeeId
                        };
                        this.props.wsClient.publish({ destination: "/api/calls/panic", body: JSON.stringify(tmp) });
                    }}><p>Panic</p></div>
                    <div className="state-elem">
                        <select className="marking">
                            <option>LINCOLN</option>
                            <option>TOM</option>
                            <option>ADAM</option>
                            <option>NOVA</option>
                        </select>
                    </div>
                </div>
                <div className="block active-calls">
                    <Translation>
                        {
                            t => <h3>{t('Title Active calls')}</h3>
                        }
                    </Translation>
                    <div>
                        <ul className="table-head">
                            <li>ID</li>
                            <li>
                                <Translation>
                                    {
                                        t => t('Time')
                                    }
                                </Translation>
                            </li>
                            <li>
                                <Translation>
                                    {
                                        t => t('Location')
                                    }
                                </Translation>
                            </li>
                            <li>
                                <Translation>
                                    {
                                        t => t('Officers')
                                    }
                                </Translation>
                            </li>
                            <li>
                                <Translation>
                                    {
                                        t => t('Action')
                                    }
                                </Translation>
                            </li>
                        </ul>
                    </div>
                    <div className="table-scroll">
                        {this.props.calls.map((o, i) =>
                            moment(new Date(o.time)).isAfter(moment().subtract(1, 'hours')) &&
                                moment(new Date(o.time)).isBefore(moment()) ?
                                <ul className="call-item" key={i} onMouseDown={this.handleDrag}>
                                    <li>{o.id}</li>
                                    <li>{new Date(o.time).toLocaleTimeString()}</li>
                                    <li>{o.location}</li>
                                    <li>{o.employees.map((e, i) =>
                                        <Link
                                            key={i}
                                            className="round-link"
                                            to={"/employees/" + e.marking}>
                                            {e.marking}
                                        </Link>
                                    )}</li>
                                    <li>
                                        <span className="link-button" onClick={(e) => {
                                            e.preventDefault();
                                            let tmp = {
                                                employeeId: this.props.store.employeeId,
                                                callId: o.id
                                            }
                                            this.props.wsClient.publish({ destination: "/api/call/officers", body: JSON.stringify(tmp) });
                                        }}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                    </li>
                                </ul>
                                : ""
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default observer(Home);