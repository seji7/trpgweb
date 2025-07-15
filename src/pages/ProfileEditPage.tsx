import React, { useEffect, useState } from "react";
import { fetchMe } from "../api/memberApi";
import { MemberInfo } from "../types/dto";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ProfileEditPage = () => {
    const [formData, setFormData] = useState<MemberInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isUserIdChecked, setIsUserIdChecked] = useState<boolean>(true); // 초기 true는 원래 아이디일 경우
    const [checkResult, setCheckResult] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMe()
            .then(data => setFormData(data))
            .catch(() => setError("정보를 불러오지 못했습니다."));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        const { name, value } = e.target;

        // userId가 바뀌면 중복 확인 초기화
        if (name === "userId" && value !== formData.userId) {
            setIsUserIdChecked(false);
            setCheckResult(null);
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleCheckUserId = async () => {
        if (!formData?.userId) return;
        try {
            const res = await api.get(`/member/check-userid?userId=${encodeURIComponent(formData.userId)}`);
            if (res.data?.available) {
                setIsUserIdChecked(true);
                setCheckResult("사용 가능한 아이디입니다.");
            } else {
                setIsUserIdChecked(false);
                setCheckResult("이미 사용 중인 아이디입니다.");
            }
        } catch {
            setIsUserIdChecked(false);
            setCheckResult("아이디 중복 확인 중 오류 발생");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        if (!isUserIdChecked) {
            setError("아이디 중복 확인을 해주세요.");
            return;
        }

        try {
            await api.put("/member/update", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            setSuccess(true);
            setTimeout(() => navigate("/rooms"), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "수정 실패");
        }
    };

    if (!formData) return <div>로딩 중...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">회원 정보 수정</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">수정되었습니다.</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">아이디</label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="userId"
                            className="form-control"
                            value={formData.userId}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleCheckUserId}
                        >
                            중복 확인
                        </button>
                    </div>
                    {checkResult && (
                        <div
                            className={`mt-1 small ${isUserIdChecked ? "text-success" : "text-danger"
                                }`}
                        >
                            {checkResult}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">이름</label>
                    <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        className="form-control"
                        value={formData.nickname}
                        onChange={handleChange}
                    />
                </div>
                <div className="d-flex justify-content-between gap-2">
                    <button type="submit" className="btn btn-primary">저장</button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/password-edit")}
                    >
                        비밀번호 변경
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditPage;