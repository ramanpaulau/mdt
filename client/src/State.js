import React from 'react';

class State extends React.Component {
    constructor(props) {
        super(props);

        this.state = { time: new Date(), notification: "" };
    }

    tick() {
        this.setState({ time: new Date() });
    }

    setNotification(text) {
        this.setState({ notification: text });
        this.timeoutID = setTimeout(() => this.setState({ notification: "" }), 7000);
    }

    componentDidMount() {
        this.intervalID = setInterval(() => this.tick(), 1000);
        this.setNotification("BOLO list has been updated.");
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
        clearTimeout(this.timeoutID);
    }

    render() {
        return(
            <div className="state">
                <p>San Andreas Highway Patrol</p>
                <p className="notification">{ this.state.notification }</p>
                <p>{this.props.store.regNum}</p>
                <p>{this.state.time.toLocaleString()}</p>
            </div>
        );
    }
}

export default State;