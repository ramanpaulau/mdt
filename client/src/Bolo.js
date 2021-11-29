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
                                <li className="regnum">{o.regNum}</li>
                                <li className="fullname">{o.name + " " + o.surname}</li>
                                <li className="phone">Phone: {o.phoneNumber}</li>
                                <Link
                                    to={"/citizens/" + (o.regNum)}
                                    className="edit-button round-link">
                                    View
                                </Link>
                            </ul>
                        )}
                    </div>
                </div>

                <div className="block vehicle-list">
                    <h3>BOLO Vehicles</h3>
                    <div className="table-scroll">
                        {this.props.boloVehicles.map((c, i) =>
                            <ul className="vehicle-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="vin">{c.vin}</li>
                                <li className="name">{c.name}</li>
                                <li className="plateNum">{c.plateNum}</li>
                                <li className="price">{c.price}$</li>
                                <Link
                                    to={"/vehicles/" + (c.plateNum)}
                                    className="edit-button round-link">
                                    View
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