import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // Spring Boot 서버 주소
    withCredentials: true             // 세션 인증(쿠키) 사용
});

export default api;