import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import './scss/auth.scss';

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			stompClient: null,
			regNum: '',
			password: '',
			idx: 0,
			authMessage: ''
		};

		this.char1Ref = React.createRef();
		this.char2Ref = React.createRef();
		this.char3Ref = React.createRef();
		this.char4Ref = React.createRef();
		this.regNumRefs = [this.char1Ref, this.char2Ref, this.char3Ref, this.char4Ref];
		this.passwordRef = React.createRef();
		this.loaderRef = React.createRef();
		this.authRef = React.createRef();
	}

	getIdx = () => {
		if (document.activeElement === this.regNumRefs[0].current)
			return 0;
		else if (document.activeElement === this.regNumRefs[1].current)
			return 1;
		else if (document.activeElement === this.regNumRefs[2].current)
			return 2;
		else
			return 3;
	}

	addChar = (e) => {
		e.key = e.key.toUpperCase();
		let idx = this.getIdx();
		this.regNumRefs[idx].current.classList.remove('error');
		this.regNumRefs[idx].current.value = e.key;
		if (idx < 3)
			this.regNumRefs[++idx].current.focus();
	}

	removeChar = (e) => {
		let idx = this.getIdx();

		if (e.key === 'Backspace' && this.regNumRefs[idx].current.value === '') {
			this.regNumRefs[(--idx < 0) ? 0 : idx].current.focus();
			e.preventDefault();
		}
	}

	getPassword = () => {
		this.passwordRef.current.classList.remove('error');
		this.setState({ password: this.passwordRef.current.value });
	}

	processAuth = async (e) => {
		e.preventDefault();
		this.setState({ authMessage: '' });
		let error = false;
		let regNum = this.regNumRefs.map(r => r.current.value).join('');
		
		// parse
		if (this.state.password.length <= 0) {
			this.passwordRef.current.classList.add('error');
			this.passwordRef.current.style.animation = 'shake 0.2s linear 1';
			setTimeout(() => { this.passwordRef.current.style.animation = 'none'; }, 200);
			error = true;
		}

		for (let i = 0; i < 4; i++) {
			if (this.regNumRefs[i].current.value === '') {
				this.regNumRefs[i].current.classList.add('error');
				this.regNumRefs[i].current.style.animation = 'shake 0.2s linear 1';
				setTimeout(() => { this.regNumRefs[i].current.style.animation = 'none'; }, 200);
				error = true;
			}
		}

		if (error)
			return;
		// end parse

		this.authRef.current.style.display = 'none';
		this.loaderRef.current.style.display = 'block';

		await axios.post("http://localhost:8081/login", {
                regNum: regNum,
                password: this.state.password,
            })
            .then((res) =>  {
				if (!res.data) {
					this.setState({ authMessage: 'Wrong credentials' });
					this.loaderRef.current.style.display = 'none';
					this.authRef.current.style.display = 'grid';
					return;
				}
				
                if (res.data) {
                    localStorage.setItem('token', res.data);
                    localStorage.setItem('regNum', regNum);
                }

				this.props.history.push("/");
            });
	}

	render() {
		return (
			<div className="loginContainer">
				<div className="loader" ref={this.loaderRef} />
				<div className="wrapper" ref={this.authRef}>
					<div className="auth-label">
						<h1>Login</h1>
					</div>
					<div className="auth-info">
						<div className="login">
							<input ref={this.char1Ref} className="loginChar" onKeyDown={this.removeChar} onKeyPress={this.addChar} type="text" maxLength="1" />
							<input ref={this.char2Ref} className="loginChar" onKeyDown={this.removeChar} onKeyPress={this.addChar} type="text" maxLength="1" />
							<input ref={this.char3Ref} className="loginChar" onKeyDown={this.removeChar} onKeyPress={this.addChar} type="text" maxLength="1" />
							<input ref={this.char4Ref} className="loginChar" onKeyDown={this.removeChar} onKeyPress={this.addChar} type="text" maxLength="1" />
						</div>
						<input ref={this.passwordRef} className="password" type="password" onKeyUp={this.getPassword} />
						<div className="authMessage">{(this.state.authMessage) ? this.state.authMessage : ""}</div>
					</div>
					<div className="auth-arrow">
						<Link to="/" onClick={this.processAuth}>
							&gt;
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
