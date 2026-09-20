import axios from "axios";

// Khởi tạo axios instance hỗ trợ credentials (để gửi Cookie refreshToken)
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8088",
    withCredentials: true,
});

// Request interceptor: Tự động đính kèm Access Token vào Header
instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor: Tự động refresh token khi gặp lỗi 401 Unauthorized
instance.interceptors.response.use(
    function (response) {
        if (response && response.data !== undefined) return response.data;
        return response;
    },
    async function (error) {
        const originalRequest = error?.config;

        const status = error?.response?.status;
        const isAuthError = status === 401;

        const requestUrl = originalRequest?.url || "";
        const isBypassUrl =
            requestUrl.includes("api/auth/login") ||
            requestUrl.includes("api/auth/register") ||
            requestUrl.includes("api/auth/refresh") ||
            requestUrl.includes("api/auth/verify-otp");

        // Nếu gặp lỗi 401 và request chưa được retry, và không phải các endpoint auth công khai
        if (isAuthError && originalRequest && !originalRequest._retry && !isBypassUrl) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return instance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Gọi API refresh token (Cookie refreshToken sẽ tự động gửi kèm nhờ withCredentials: true)
                const res = await instance.post("api/auth/refresh");

                const newAccessToken = res?.data?.accessToken || res?.accessToken;

                if (res && (res.success || newAccessToken)) {
                    const tokenToSave = newAccessToken || res?.data?.accessToken;
                    if (tokenToSave) {
                        localStorage.setItem("access_token", tokenToSave);
                        instance.defaults.headers.common.Authorization = `Bearer ${tokenToSave}`;
                        originalRequest.headers.Authorization = `Bearer ${tokenToSave}`;

                        processQueue(null, tokenToSave);
                        return instance(originalRequest);
                    }
                }

                throw new Error(res?.message || "Refresh token không thành công");
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");

                // Nếu refresh thất bại, chuyển hướng về trang đăng nhập
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Trả về dữ liệu lỗi từ server nếu có (để các form hiển thị thông báo lỗi như sai mật khẩu...)
        if (error?.response?.data) {
            return error.response.data;
        }

        return Promise.reject(error);
    }
);

export default instance;
