import { observable, action, makeObservable } from "mobx";
import axios from 'axios';

export class User {
    regNum = '';
    admin = false;

    constructor() {
        makeObservable(this,
            {
                regNum: observable,
                clear: action,
                loadUser: action
            }
        );
    }

    clear = () => {
        localStorage.removeItem('token');
        this.regNum = '';
        this.admin = false;
    }

    wsConnect = () => {}

    loadUser = async () => {
        let token = localStorage.getItem('token');
        let regNum = localStorage.getItem('regNum');

        if (!regNum)
            return;

        if (!token) {
            this.regNum = '';
            return;
        }

        console.log(token);
        console.log(regNum);
        await axios.post("http://localhost:8081/check_token", { regNum: regNum, token: token })
            .then((res) => {
                if (res.data) {
                    if (!res.data)
                        this.clear();
                    else
                        this.wsConnect();
                    if (res.data.expired === false) {
                        this.regNum = res.data.regNum;
                        this.admin = res.data.admin;
                    } else {
                        axios.post("http://localhost:8081/refresh_token", regNum, { headers: { 'Content-Type' : 'text/plain' } })
                        .then((res) => {
                            if (!res.data)
                                this.clear();
                            else
                                localStorage.setItem('token', res.data);
                        });
                    }
                } else {
                    this.clear();
                }
            });
    }
};

export const user = new User();