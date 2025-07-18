import api from "./axiosInstance";
import { MemberRegisterRequest, LoginRequest, MemberInfo } from "../types/dto";

// 회원가입
export const registerMember = async (data: MemberRegisterRequest) => {
    const res = await api.post("/member/join", data);
    return res.data;
};

export const login = async (data: LoginRequest) => {
    const res = await api.post("/member/login", data);
    const { accessToken, refreshToken } = res.data.data; // ApiResponse<TokenResponse>

    // ✅ 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return res.data;
};

export const fetchMe = async (): Promise<MemberInfo> => {
    const res = await api.get("/member/me");
    return res.data;
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
};