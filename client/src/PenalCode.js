import React from "react";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Collapsible from 'react-collapsible';
import AddChapter from "./ModalWindows/AddChapter";
import AddLaw from "./ModalWindows/AddLaw";

class PenalCode extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chapters: []
        };
    }

    componentDidMount = () => {
        this.loadChapters();
    }

    loadChapters = async () => {
        axios.get("http://localhost:8081/penal-code").then((res) => {
            this.setState({ chapters: res.data });
        });
    }

    addChapter = async (title) => {
        await axios.post("http://localhost:8081/penal-code/chapter", title, { headers: { 'Content-Type': 'text/plain' } }).then(res => {
            if (res.data.success)
                this.loadChapters();
            else
                console.log(res.data.message);
        });
    }

    addSubchapter = async (ch, title) => {
        await axios.post("http://localhost:8081/penal-code/subchapter", JSON.stringify({ chapter: ch, title: title }), { headers: { 'Content-Type': 'text/plain' } }).then(res => {
            if (res.data.success)
                this.loadChapters();
            else
                console.log(res.data.message);
        });
    }

    addLaw = async (ch, su, text, fine, detention) => {
        await axios.post("http://localhost:8081/penal-code/law", JSON.stringify({ chapter: ch, subchapter: su, text: text, fine: fine, detention: detention }), { headers: { 'Content-Type': 'text/plain' } }).then(res => {
            if (res.data.success)
                this.loadChapters();
            else
                console.log(res.data.message);
        });
    }

    removeChapter = async (ch) => {
        await axios.delete("http://localhost:8081/penal-code/chapter/" + ch).then(res => {
            if (res.data.success)
                this.loadChapters();
            else
                console.log(res.data.message);
        });
    }

    removeSubchapter = async (ch, su) => {
        await axios.delete("http://localhost:8081/penal-code/subchapter/" + ch + "/" + su).then(res => {
            if (res.data.success)
                this.loadChapters();
            else
                console.log(res.data.message);
        });
    }

    removeLaw = async (ch, su, la) => {
        await axios.delete("http://localhost:8081/penal-code/law/" + ch + "/" + su + "/" + la).then(res => {
            if (res.data.success)
                this.loadChapters();
            else
                console.log(res.data.message);
        });
    }

    render() {
        return (
            <div className="penal-code">
                <div className="table-scroll">
                    <ul>
                        {this.state.chapters.map((ch) =>
                            <li key={ch.number}>
                                <Collapsible open={true} trigger={<CollapsibleTrigger chapter={ch.number} value={ch.title} remove={() => this.removeChapter(ch.number)} />}>
                                    <ul>
                                        {ch.subchapters.map(su =>
                                            <li key={su.number}>
                                                <Collapsible open={true} trigger={<CollapsibleTrigger chapter={ch.number} subchapter={su.number} value={su.title} remove={() => this.removeSubchapter(ch.number, su.number)} />} >
                                                    <ul>
                                                        {su.laws.map(la =>
                                                            <li key={la.number}>
                                                                <Collapsible open={true} trigger={<CollapsibleTrigger chapter={ch.number} subchapter={su.number} law={la.number} value={la.text} remove={() => this.removeLaw(ch.number, su.number, la.number)} />} >
                                                                    <ul>
                                                                        {(la.fine !== 0) ? <li>Max fine: {la.fine}</li> : ""}
                                                                        {(la.detention !== 0) ? <li>Max detention: {la.detention}</li> : ""}
                                                                    </ul>
                                                                </Collapsible>
                                                            </li>
                                                        )}
                                                        <li className="add"><AddLaw callback={(title, fine, detention) => this.addLaw(ch.number, su.number, title, fine, detention)} /></li>
                                                    </ul>
                                                </Collapsible>
                                            </li>
                                        )}
                                        <li className="add"><AddChapter callback={(title) => this.addSubchapter(ch.number, title)} /></li>
                                    </ul>
                                </Collapsible>
                            </li>
                        )}
                        <li className="add"><AddChapter callback={(title) => this.addChapter(title)} /></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default PenalCode;

class CollapsibleTrigger extends React.Component {
    render() {
        if (this.props.subchapter === undefined && this.props.law === undefined)
            return (
                <span className="title">
                    <span className="number">{this.props.chapter}</span>
                    <span className="text">{": " + this.props.value}</span>
                    <span className="delete"><FontAwesomeIcon icon={faTimesCircle} onClick={() => this.props.remove()} /></span>
                </span>
            )
        else if (this.props.law === undefined)
            return (
                <span className="title">
                    <span className="number">{this.props.chapter + "." + this.props.subchapter}</span>
                    <span className="text">{": " + this.props.value}</span>
                    <span className="delete"><FontAwesomeIcon icon={faTimesCircle} onClick={() => this.props.remove()} /></span>
                </span>
            )
        return (
            <span className="title">
                <span className="number">{this.props.chapter + "." + this.props.subchapter + "." + this.props.law}</span>
                <span className="text">{": " + this.props.value}</span>
                <span className="delete"><FontAwesomeIcon icon={faTimesCircle} onClick={() => this.props.remove()} /></span>
            </span>
        )
    }
}