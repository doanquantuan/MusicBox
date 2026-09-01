import axios from "./axios.customize";

const apiLogin = (email, password) => {
    return axios.post("api/auth/login", { email, password });
};

export {
    apiLogin
};