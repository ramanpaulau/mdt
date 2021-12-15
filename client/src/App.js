import React from 'react';
import Login from './Login';
import Home from './Home';
import { Route, Switch } from "react-router-dom";
import Error404 from './404';
import Header from './Header';
import State from './State';
import Fines from './Fines';
import Calls from './Calls';
import Vehicles from './Vehicles';
import Bolo from './Bolo';
import Incidents from './Incidents';
import Indictments from './Indictments';
import Citizens from './Citizens';
import PenalCode from './PenalCode';
import Employees from './Employees';
import Inventory from './Inventory';
import Departments from './Departments';
import RequireAuth from './auth/RequireAuth';
import { user } from './auth/User';
import RequireNotAuth from './auth/RequireNotAuth';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

import './scss/main.scss';
import Licenses from './Licenses';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            citizens: [],
            boloCitizens: [],
            boloVehicles: [],
            activeOfficers: [],
            calls: [],
            isLoading: true,
            notification: ""
        }
    }

    componentDidMount = async () => {
        user.wsConnet = this.wsConnect();

        await axios.all([
            axios.get("http://localhost:8081/persons"),
            axios.get("http://localhost:8081/bolo/persons"),
            axios.get("http://localhost:8081/bolo/vehicles"),
            axios.get("http://localhost:8081/employee/states"),
            axios.get("http://localhost:8081/calls")])
            .then(axios.spread((res1, res2, res3, res4, res5) => {
                res1.data = res1.data.map(c => {
                    c.birthdate = new Date(c.birthdate); return c;
                });
                this.setState({
                    citizens: res1.data,
                    boloCitizens: res2.data,
                    boloVehicles: res3.data,
                    activeOfficers: res4.data,
                    calls: res5.data,
                    isLoading: false
                })
            }))
            .catch(error => console.log(error));
    }

    wsConnect = () => {
        if (this.client)
            return;

        this.client = new Client();

        this.client.configure({
            webSocketFactory: () => new SockJS("http://localhost:8081/mdt"),
            onConnect: () => {
                this.client.subscribe('/ws/persons', citizen => {
                    let citizenBody = JSON.parse(citizen.body);
                    if (this.state.citizens.some(c => c.regNum === citizenBody.regNum)) {
                        this.setState({ citizens: [...this.state.citizens.filter(c => c.regNum !== citizenBody.regNum), citizenBody].sort((a, b) => (a.regNum > b.regNum) ? 1 : (a.regNum === b.regNum) ? 0 : -1) });
                    } else {
                        this.setState({ citizens: [...this.state.citizens, citizenBody] });
                        this.setNotification("Citizens database has been updated.");
                    }
                });

                this.client.subscribe('/ws/bolo/persons', citizen => {
                    citizen = JSON.parse(citizen.body);
                    if (!citizen)
                        return;

                    if (citizen.action === "add") {
                        this.setState({ boloCitizens: [...this.state.boloCitizens, citizen.body] });
                    } else if (citizen.action === "delete") {
                        this.setState({ boloCitizens: [...this.state.boloCitizens.filter(c => c.record.regNum !== citizen.body.record.regNum)] });
                    }
                    this.setNotification("BOLO list has been updated.");
                });

                this.client.subscribe('/ws/bolo/vehicles', vehicle => {
                    vehicle = JSON.parse(vehicle.body);
                    if (!vehicle)
                        return;

                    if (vehicle.action === "add") {
                        this.setState({ boloVehicles: [...this.state.boloVehicles, vehicle.body] });
                    } else if (vehicle.action === "delete") {
                        this.setState({ boloVehicles: [...this.state.boloVehicles.filter(v => v.record.vin !== vehicle.body.record.vin)] });
                    }
                    this.setNotification("BOLO list has been updated.");
                });

                this.client.subscribe('/ws/active/employees', res => {
                    let data = JSON.parse(res.body);
                    if (data.action === "add") {
                        this.setState({ activeOfficers: [...this.state.activeOfficers, { employee: data.employee, state: data.state }] });
                    } else if (data.action === "delete") {
                        this.setState({ activeOfficers: [...this.state.activeOfficers.filter(o => o.employee.id !== data.employee.id)] });
                    } else {
                        this.setState({ activeOfficers: [...this.state.activeOfficers.filter(o => o.employee.id !== data.employee.id), { employee: data.employee, state: data.state, unit: data.unit }] });
                    }
                });

                this.client.subscribe('/ws/calls', call => {
                    if (!call.body)
                        return;
                    let callBody = JSON.parse(call.body);
                    if (this.state.calls.some(c => c.id === callBody.id)) {
                        this.setState({ calls: [callBody, ...this.state.calls.filter(c => c.id !== callBody.id)].sort((a, b) => (a.time > b.time) ? -1 : (a.time === b.time) ? 0 : 1) });
                    } else {
                        this.setState({ calls: [callBody, ...this.state.calls] });
                        this.setNotification("Calls list has been updated.");
                    }
                });
            },

            debug: (str) => {
                //console.log(new Date(), str);
            }
        });

        this.client.activate();
    }

    wsDisconnect = () => {
        if (this.client)
            this.client.deactivate();
        this.client = null;
    }

    setNotification(text) {
        if (this.timeoutID)
            clearTimeout(this.timeoutID);
        this.setState({ notification: text });
        this.timeoutID = setTimeout(() => this.setState({ notification: "" }), 7000);
    }

    componentWillUnmount = () => {
        this.wsDisconnect();
        clearTimeout(this.timeoutID);
    }

    render() {
        if (this.state.isLoading)
            return (<div></div>)
        return (
            <Switch>
                <Route exact path="/login" component={RequireNotAuth((props) => <Login {...props} store={user} wsConnect={this.wsConnect} />)} />
                <React.Fragment>
                    <div className="app">
                        <Header store={user} wsDisconnect={this.wsDisconnect} />
                        <State store={user} notification={this.state.notification} />
                        <main>
                            <Switch>
                                <Route exact path="/" component={RequireAuth((props) => <Home {...props} store={user} wsClient={this.client} boloCitizens={this.state.boloCitizens} boloVehicles={this.state.boloVehicles} calls={this.state.calls} activeOfficers={this.state.activeOfficers} />, user)} />
                                <Route exact path="/calls/:id?" component={RequireAuth((props) => <Calls {...props} wsClient={this.client} calls={this.state.calls} store={user} />, user)} />
                                <Route exact path="/vehicles/:plateNum?" component={RequireAuth((props) => <Vehicles {...props} store={user} />, user)} />
                                <Route exact path="/licenses" component={RequireAuth((props) => <Licenses {...props} />, user)} />
                                <Route exact path="/bolo" component={RequireAuth((props) => <Bolo {...props} boloCitizens={this.state.boloCitizens} boloVehicles={this.state.boloVehicles} />, user)} />
                                <Route exact path="/fines" component={RequireAuth((props) => <Fines {...props} citizens={this.state.citizens} store={user} />, user)} />
                                <Route exact path="/incidents/:id?" component={RequireAuth((props) => <Incidents {...props} wsClient={this.client} store={user} citizens={this.state.citizens} />, user)} />
                                <Route exact path="/indictments/:id?" component={RequireAuth((props) => <Indictments {...props} wsClient={this.client} citizens={this.state.citizens} store={user} />, user)} />
                                <Route exact path="/employees/:marking?" component={RequireAuth((props) => <Employees  {...props} citizens={this.state.citizens} />, user)} />
                                <Route exact path="/departments/:code?" component={RequireAuth((props) => <Departments {...props} store={user} />, user)} />
                                <Route exact path="/citizens/:regNum?" component={RequireAuth((props) => <Citizens {...props} wsClient={this.client} store={user} citizens={this.state.citizens} />, user)} />
                                <Route exact path="/inventory" component={RequireAuth(() => <Inventory />, user)} />
                                <Route exact path="/penalcode" component={RequireAuth(() => <PenalCode />, user)} />
                                <Route path="*" component={RequireAuth(Error404, user)} />
                            </Switch>
                        </main>
                    </div>
                </React.Fragment>
            </Switch>);
    };
}

export default App;