import React from "react";
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";
import { Translation } from 'react-i18next';

class Bolo extends React.Component {

    componentDidMount = () => {
        //console.log(this.props.boloCitizens);
    }

    render() {
        console.log(this.props.boloVehicles);
        return (
            <div className="bolo">
                <div className="block citizen-list">
                    <Translation>
                        {
                            t => <h3>{t('Title BOLO Citizens')}</h3>
                        }
                    </Translation>
                    <div className="table-scroll">
                        {this.props.boloCitizens.map((o, i) =>
                            <ul className="citizen-item" key={i} onMouseDown={this.handleDrag}>
                                <li className="fullname">{o.record.name + " " + o.record.surname}</li>
                                <li className="phone">
                                    <Translation>
                                        {
                                            t => t('Form Phone')
                                        }
                                    </Translation>: {o.record.phoneNumber}</li>
                                <Link
                                    to={"/incidents/" + o.incident.id}
                                    className="edit-button round-link">
                                    <Translation>
                                        {
                                            t => t('Incident')
                                        }
                                    </Translation>: {o.incident.id}
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
                    <Translation>
                        {
                            t => <h3>{t('Title BOLO Vehicles')}</h3>
                        }
                    </Translation>
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