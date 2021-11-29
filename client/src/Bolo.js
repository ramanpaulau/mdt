import React from "react";
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";

class Bolo extends React.Component {

    componentDidMount = () => {
        this.props.clearNots("bolo");
    }

    render() {
        return (
            <div className="bolo">
                <div className="block citizen-list">
                    <h3>BOLO Citizens</h3>
                    <div className="table-scroll">
                        {this.props.boloCitizens.map((o, i) =>
                            <ul className="citizen-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="fullname">{o.record.name + " " + o.record.surname}</li>
                                <li className="phone">Phone: {o.record.phoneNumber}</li>
                                <Link
                                    to={"/incidents/" + o.incident.id}
                                    className="edit-button round-link">
                                    Incident: {o.incident.id}
                                </Link>
                                <Link
                                    to={"/citizens/" + (o.record.regNum)}
                                    className="edit-button round-link">
                                    {o.record.regNum}
                                </Link>
                            </ul>
                        )}
                    </div>
                </div>

                <div className="block car-list">
                    <h3>BOLO Vehicles</h3>
                    <div className="table-scroll">
                        {this.props.boloVehicles.map((o, i) =>
                            <ul className="car-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="vin">VIN: {o.record.vin}</li>
                                <li className="name">{o.record.name}</li>
                                <Link
                                    to={"/incidents/" + o.incident.id}
                                    className="edit-button round-link">
                                    Incident: {o.incident.id}
                                </Link>
                                <Link
                                    to={"/vehicles/" + (o.record.plateNum)}
                                    className="edit-button round-link">
                                    {o.record.plateNum}
                                </Link>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default observer(Bolo);