import { observable, action, makeObservable } from "mobx";
import axios from 'axios';

export class User {
    regNum = '';
    admin = false;
    employee = {};

    constructor() {
        makeObservable(this,
            {
                regNum: observable,
                employee: observable,
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
                    axios.get("http://localhost:8081/get_employee_info/" + res.data.regNum).then(res => {
                        this.employee = res.data;
                    });
                } else {
                    this.clear();
                }
            });
    }
};

export const user = new User();