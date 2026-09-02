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

export {
    apiLogin,
    apiRegister,
    apiVerifyOtp,
    apiResendOtp
};