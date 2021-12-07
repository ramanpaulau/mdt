import React from 'react';
import { observer } from "mobx-react";

class State extends React.Component {
    constructor(props) {
        super(props);

        this.state = { time: new Date() };
    }

    tick() {
        this.setState({ time: new Date() });
    }

    componentDidMount() {
        this.intervalID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render() {
        return(
            <div className="state">
                <p>{this.props.store.department}</p>
                <p className="notification">{ this.props.notification }</p>
                <p>{this.props.store.regNum}</p>
                <p>{this.state.time.toLocaleString()}</p>
            </div>
        );
    }
}

export default observer(State);