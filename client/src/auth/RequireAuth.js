import React from 'react';
import { Redirect } from 'react-router-dom';

const RequireAuth = (Component, user) => {
    return class App extends React.Component { 
        constructor(props) {
            super(props);
            this.state = {
                redirect: ''
            };

            const token = localStorage.getItem('token'); 

            if(!token) {
                this.state = {
                    redirect: '/login'
                };
                return;
            }

            user.loadUser();
        }
        
        render() {
            if (this.state.redirect) {
                return <Redirect to={this.state.redirect} />;
            }
            return <Component {...this.props} />;
        }
    } 

} 

export default RequireAuth;