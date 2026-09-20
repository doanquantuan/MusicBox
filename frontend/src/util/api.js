import axios from "./axios.customize";

const apiLogin = (email, password) => {
    return axios.post("api/auth/login", { email, password });
};

const apiRegister = (name, email, password) => {
    return axios.post("api/auth/register", { name, email, password });
};

const apiVerifyOtp = (email, otp) => {
    return axios.post("api/auth/verify-otp", { email, otp });
};

const apiResendOtp = (email) => {
    return axios.post("api/auth/resend-otp", { email });
};

const apiGetAccount = () => {
    return axios.get("api/auth/me");
};

const apiLogout = () => {
    return axios.post("api/auth/logout");
};

const apiGetTopics = () => {
    return axios.get("api/topics");
};

const apiRefreshToken = () => {
    return axios.post("api/auth/refresh");
};

export {
    apiLogin,
    apiRegister,
    apiVerifyOtp,
    apiResendOtp,
    apiGetAccount,
    apiLogout,
    apiGetTopics,
    apiRefreshToken
};