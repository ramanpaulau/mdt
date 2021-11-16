import React from 'react';
import Login from './Login';
import Home from './Home';
import { Route, Switch } from "react-router-dom";
import Error404 from './404';
import Header from './Header';
import State from './State';
import Calls from './Calls';
import Citizens from './Citizens';
import RequireAuth from './auth/RequireAuth';
import { user } from './auth/User';
import RequireNotAuth from './auth/RequireNotAuth';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

import './scss/main.scss';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            calls: 5,
            citizens: []
        }
    }

    componentDidMount = async () => {
        user.wsConnet = this.wsConnect();

        await axios.get("http://localhost:8081/persons")
            .then((res) => {
                res.data = res.data.map(c => {
                    c.birthdate = new Date(c.birthdate); return c;
                });
                this.setState({
                    citizens: res.data
                });
            });
    }

    wsConnect = () => {
        if (this.client)
            return;

        this.client = new Client();

        this.client.configure({
            webSocketFactory: () => new SockJS("http://localhost:8081/mdt"),
            onConnect: () => {
                this.client.subscribe('/ws/persons', citizen => {
                    this.setState({ citizens: [...this.state.citizens, JSON.parse(citizen.body)] });
                });
            },

            debug: (str) => {
                console.log(new Date(), str);
            }
        });

        this.client.activate();
    }

    wsDisconnect = () => {
        if (this.client)
            this.client.deactivate();
        this.client = null;
    }

    componentWillUnmount = () => {
        this.wsDisconnect();
    }

    clearNotifications = (name) => {
        this.setState({ [name]: 0 });
    }

    render() {
        return (
            <Switch>
                <Route exact path="/login" component={RequireNotAuth((props) => <Login {...props} store={user} wsConnect={this.wsConnect} />)} />
                <React.Fragment>
                    <div className="app">
                        <Header calls={this.state.calls} store={user} wsDisconnect={this.wsDisconnect} />
                        <State store={user} />
                        <main>
                            <Switch>
                                <Route exact path="/" component={RequireAuth(Home, user)} />
                                <Route exact path="/calls/:id?" component={RequireAuth((props) => <Calls clearNots={(this.state.calls) ? this.clearNotifications : () => { }} {...props} />, user)} />
                                <Route exact path="/citizens/:id?" component={RequireAuth((props) => <Citizens {...props} wsClient={this.client} citizens={this.state.citizens} />, user)} />
                                <Route path="*" component={RequireAuth(Error404, user)} />
                            </Switch>
                        </main>
                    </div>
                </React.Fragment>
            </Switch>);
    };
}

export default App;