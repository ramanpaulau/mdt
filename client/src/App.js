import React from 'react';
import Login from './Login';
import Home from './Home';
import { Route, Switch, Router } from "react-router-dom";
import Error404 from './404';
import Header from './Header';
import State from './State';
import Calls from './Calls';
import Citizens from './Citizens';
import RequireAuth from './auth/RequireAuth';
import { user } from './auth/User';
import RequireNotAuth from './auth/RequireNotAuth';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import './scss/main.scss';

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          calls: 5
      }
  } 

  componentDidMount = () => {/*
    this.client = new Client();

    this.client.configure({
      webSocketFactory: () => new SockJS("http://localhost:8081/mdt"),
      onConnect: () => {
        console.log('onConnect');

        this.client.subscribe('/api/employee', greeting => {
          alert(greeting.body);
        });
      },
      
      debug: (str) => {
        console.log(new Date(), str);
      }
    });

    this.client.activate();*/
  }

  clearNotifications = (name) => {
    this.setState({ [name]: 0 });
  }

  render() {
		return (
      <Switch>
        <Route exact path="/login" component={(props) => <Login {...props} store={user} />} />
        <React.Fragment>
        <div className="app">
          <Header calls={this.state.calls} store={user} />
          <State store={user} />
          <main>
            <Switch>
              <Route exact path="/" component={RequireAuth(Home, user)} />
              <Route exact path="/calls/:id?" component={RequireAuth((props) => <Calls clearNots={(this.state.calls)?this.clearNotifications:()=>{}} {...props} />, user)} />
              <Route exact path="/citizens/:id?" component={RequireAuth((props) => <Citizens {...props} />, user)} />
              <Route path="*" component={RequireAuth(Error404, user)} />
            </Switch>
          </main>
        </div>
        </React.Fragment>
      </Switch>);
	};
}

export default App;