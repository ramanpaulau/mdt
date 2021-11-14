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

    loadUser = async () => {
        let token = localStorage.getItem('token');

        if (!token) {
            this.regNum = '';
            return;
        }

        await axios.post("http://localhost:8081/check_token", { regNum: this.regNum, token: token })
            .then((res) => {
                if (res.data) {
                    if (!res.data)
                        this.clear();
                    if (res.data.expired === false) {
                        this.regNum = res.data.regNum;
                        this.admin = res.data.admin;
                    } else {
                        console.log(this.regNum);
                        axios.post("http://localhost:8081/refresh_token", this.regNum, { headers: { 'Content-Type' : 'text/plain' } })
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