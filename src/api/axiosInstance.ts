import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");

    // ✅ 로그인, 회원가입, 리프레시 요청은 토큰 없이 허용
    const noAuthRequired = [
        "/member/login",
        "/member/join",
        "/member/register",
        "/member/member/refresh-token"
    ];

    const isNoAuthRequest = noAuthRequired.some(path => config.url?.includes(path));

    if (!accessToken && !isNoAuthRequest) {
        console.warn("❌ 요청 차단됨: accessToken 없음");
        return Promise.reject({ message: "No access token" });
    }

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// ✅ 응답 인터셉터 - access 만료 시 refresh 요청
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry // 무한루프 방지
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                if (window.location.pathname !== "/login") {
                    window.alert("세션이 만료되었습니다.");
                    window.location.href = "/login";
                }

                return Promise.reject(error); // 재요청 금지
            }

            try {
                // ✅ access 재발급 요청
                const res = await axios.post("http://localhost:8080/member/member/refresh-token", null, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    }
                });

                const newAccessToken = res.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                // 원래 요청에 토큰 다시 설정하고 재요청
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // ✅ refresh 만료 → 로그아웃 처리
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.alert("세션이 만료되어 다시 로그인해야 합니다.");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;