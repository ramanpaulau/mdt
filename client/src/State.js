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
        this.intervalID = setTimeout(() => this.setState({ notification: "" }), 7000);
    }

    componentDidMount() {
        this.timeoutID = setInterval(() => this.tick(), 1000);
        this.setNotification("BOLO list has been updated.");
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        clearTimeout(this.timeoutID);
    }

    render() {
        return(
            <div className="state">
                <p>San Andreas Highway Patrol</p>
                <p className="notification">{ this.state.notification }</p>
                <p>1-LN-10</p>
                <p>{this.state.time.toLocaleString()}</p>
            </div>
        );
    }
}

export default State;