import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faPhone, faIdCardAlt, faCar, faCoins, faFileAlt, faEye, faWarehouse, faGavel, faLandmark, faTimes, faList, faUserTie, faStamp } from '@fortawesome/free-solid-svg-icons';
import { observer } from "mobx-react";
import i18n from './i18n';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.menu = React.createRef();
        this.line1 = React.createRef();
        this.line2 = React.createRef();
    }

    navigate = () => {
        const menu = this.menu.current;
        if (!menu) return;
        menu.classList.remove("opened");
        this.burgerToggleAnim();
        window.scrollTo(0, 0);
    };

    burgerToggleAnim = () => {
        const menu = this.menu.current;
        const line1 = this.line1.current;
        const line2 = this.line2.current;

        if (!menu || !line1 || !line2) return;

        if (menu.classList.contains("opened")) {
            line1.style.transform = "translateY(5px) rotate(45deg)";
            line2.style.transform = "translateY(-5px) rotate(-45deg)";
        } else {
            line1.style.transform = "translateY(0px) rotate(0deg)";
            line2.style.transform = "translateY(0px) rotate(0deg)";
        }
    };

    onBurgerClick = () => {
        const menu = this.menu.current;

        if (!menu) return;

        menu.classList.toggle("opened");
        this.burgerToggleAnim();
    };

    signOut = () => {
        this.props.store.clear();
    };

    render() {
        return (
            <header className="header">
                <nav className="nav" ref={this.menu}>
                    <ul className="nav-ul">
                        {((this.props.store.employeeId) || (this.props.store.admin)) ?
                            <li className="nav-li">
                                <NavLink
                                    exact
                                    to="/"
                                    className="nav-a"
                                    activeClassName="active-nav-a"
                                    onClick={this.navigate}>
                                    <FontAwesomeIcon icon={faGlobe} />
                                </NavLink>
                            </li>
                            : ""}
                        <li className="nav-li">
                            <NavLink
                                to="/calls"
                                className="nav-a"
                                activeClassName="active-nav-a"
                                onClick={this.navigate}>
                                <FontAwesomeIcon icon={faPhone} />
                            </NavLink>
                        </li>
                        {((this.props.store.employeeId) || (this.props.store.admin)) ?
                            <li className="nav-li">
                                <NavLink
                                    to="/citizens"
                                    className="nav-a"
                                    activeClassName="active-nav-a"
                                    onClick={this.navigate}>
                                    <FontAwesomeIcon icon={faIdCardAlt} />
                                </NavLink>
                            </li>
                            : ""}
                        {((this.props.store.leader) || (this.props.store.admin)) ?
                            <li className="nav-li">
                                <NavLink
                                    exact
                                    to="/licenses"
                                    className="nav-a"
                                    activeClassName="active-nav-a"
                                    onClick={this.navigate}>
                                    <FontAwesomeIcon icon={faStamp} />
                                </NavLink>
                            </li>
                            : ""}
                        <li className="nav-li">
                            <NavLink
                                to="/vehicles"
                                className="nav-a"
                                activeClassName="active-nav-a"
                                onClick={this.navigate}>
                                <FontAwesomeIcon icon={faCar} />
                            </NavLink>
                        </li>
                        {((this.props.store.employeeId) || (this.props.store.admin)) ?
                            <li className="nav-li">
                                <NavLink
                                    to="/incidents"
                                    className="nav-a"
                                    activeClassName="active-nav-a"
                                    onClick={this.navigate}>
                                    <FontAwesomeIcon icon={faFileAlt} />
                                </NavLink>
                            </li>
                            : ""}
                        {((this.props.store.employeeId) || (this.props.store.admin)) ?
                            <li className="nav-li">
                                <NavLink
                                    to="/indictments"
                                    className="nav-a"
                                    activeClassName="active-nav-a"
                                    onClick={this.navigate}>
                                    <FontAwesomeIcon icon={faGavel} />
                                </NavLink>
                            </li>
                            : ""}
                        <li className="nav-li">
                            <NavLink
                                to="/fines"
                                className="nav-a"
                                activeClassName="active-nav-a"
                                onClick={this.navigate}>
                                <FontAwesomeIcon icon={faCoins} />
                            </NavLink>
                        </li>
                        {((this.props.store.employeeId) || (this.props.store.admin)) ?
                            <li className="nav-li">
                                <NavLink
                                    to="/bolo"
                                    className="nav-a"
                                    activeClassName="active-nav-a"
                                    onClick={this.navigate}>
                                    <FontAwesomeIcon icon={faEye} />
                                </NavLink>
                            </li>
                            : ""}
                        <li className="nav-li">
                            <NavLink
                                to="/departments"
                                className="nav-a"
                                activeClassName="active-nav-a"
                                onClick={this.navigate}>
                                <FontAwesomeIcon icon={faLandmark} />
                            </NavLink>
                        </li>
                        <li className="nav-li">
                            <NavLink
                                to="/employees"
                                className="nav-a"
                                activeClassName="active-nav-a"
                                onClick={this.navigate}>
                                <FontAwesomeIcon icon={faUserTie} />
                            </NavLink>
                        </li>
                        {((this.props.store.employeeId) || (this.props.store.admin)) ?
                            <li className="nav-li">
                                <NavLink
                                    to="/inventory"
                                    className="nav-a"
                                    activeClassName="active-nav-a"
                                    onClick={this.navigate}>
                                    <FontAwesomeIcon icon={faWarehouse} />
                                </NavLink>
                            </li>
                            : ""}
                        <li className="nav-li">
                            <NavLink
                                to="/penalcode"
                                className="nav-a"
                                activeClassName="active-nav-a"
                                onClick={this.navigate}>
                                <FontAwesomeIcon icon={faList} />
                            </NavLink>
                        </li>
                        <li className="nav-li">
                            <LanguagePicker />
                        </li>
                        <li className="nav-li">
                            <NavLink
                                to="/login"
                                className="nav-a"
                                activeClassName="active-nav-a"
                                onClick={() => {
                                    this.props.wsDisconnect();
                                    this.signOut();
                                    this.navigate();
                                }}>
                                <FontAwesomeIcon icon={faTimes} />
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="burger" onClick={this.onBurgerClick}>
                    <div className="line" ref={this.line1}></div>
                    <div className="line" ref={this.line2}></div>
                </div>
            </header>
        );
    }
}

export default observer(Header);

class LanguagePicker extends React.Component {

    langs = ['en', 'cz', 'ru'];

    constructor() {
        super();

        this.state = {
            lang: 'en',
            idx: 0
        }
    }

    componentDidMount = () => {
        let lang = localStorage.getItem('lang');
        if (!lang) {
            localStorage.setItem('lang', this.langs[0]);
            lang = 'en';
        }
        this.setState({ lang: lang, idx: (lang === 'en') ? 0 : (lang === 'cz') ? 1 : 2 });
        i18n.changeLanguage(lang);
    }

    changeLanguage = () => {
        let idx = (this.state.idx + 1) % 3;
        localStorage.setItem('lang', this.langs[idx]);
        this.setState({ lang: this.langs[idx], idx: idx });
        i18n.changeLanguage(this.langs[idx]);
    }

    render() {
        return (
            <h1 className="lang-select" onClick={() => this.changeLanguage()} style={{ textTransform: 'uppercase' }}>{this.state.lang}</h1>
        )
    }
}