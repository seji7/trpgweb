import api from "./axiosInstance";
import { MemberRegisterRequest, LoginRequest, MemberInfo } from "../types/dto";

// 회원가입
export const registerMember = async (data: MemberRegisterRequest) => {
    const res = await api.post("/member/join", data);
    return res.data;
};

// 로그인 (userId는 username으로 보냄)
export const login = async (data: LoginRequest) => {
    const res = await api.post("/member/login", data, {
        headers: { "Content-Type": "application/json" }
    });
    return res.data; // 실제 성공시 세션 쿠키 발급, 별도 반환 데이터는 없음
};

export const fetchMe = async (): Promise<MemberInfo> => {
    const res = await api.get("/member/me", { withCredentials: true });
    return res.data;
};

export const logout = async (): Promise<void> => {
    await api.post("/member/logout", null, { withCredentials: true });
};