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

  send = () => {
    this.client.publish({destination: "/ws/string", body: "Ivan"});
  }

  clearNotifications = (name) => {
    this.setState({ [name]: 0 });
  }

  render() {
		return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <React.Fragment>
        <div className="app">
          {/*<button onClick={(e) => {e.preventDefault(); this.send();}} />*/}
          <Header calls={this.state.calls} />
          <State />
          <main>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/calls/:id?" render={(props) => <Calls clearNots={this.clearNotifications} {...props} />} />
              <Route exact path="/citizens/:id?" render={(props) => <Citizens {...props} />} />
              <Route exact path="/reqauth" component={RequireAuth((props) => <Citizens {...props} />)} />
              <Route path="*" component={RequireAuth(() => <Error404 />)} />
            </Switch>
          </main>
        </div>
        </React.Fragment>
      </Switch>);
	};
}

export default App;