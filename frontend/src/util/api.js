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

const apiGetTopicById = (topicId) => {
    return axios.get(`api/topics/${topicId}`);
};

const apiGetPlaylistsByTopic = (topicId) => {
    return axios.get(`api/topics/${topicId}/playlists`);
};

const apiAddPlaylistToTopic = (topicId, playlistId) => {
    return axios.post(`api/topics/${topicId}/playlists/${playlistId}`);
};

const apiRemovePlaylistFromTopic = (topicId, playlistId) => {
    return axios.delete(`api/topics/${topicId}/playlists/${playlistId}`);
};

const apiGetPlaylistById = (playlistId) => {
    return axios.get(`api/playlists/${playlistId}`);
};

const apiGetSongsInPlaylist = (playlistId) => {
    return axios.get(`api/playlists/${playlistId}/songs`);
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
    apiGetTopicById,
    apiGetPlaylistsByTopic,
    apiAddPlaylistToTopic,
    apiRemovePlaylistFromTopic,
    apiRefreshToken,
    apiGetPlaylistById,
    apiGetSongsInPlaylist
};