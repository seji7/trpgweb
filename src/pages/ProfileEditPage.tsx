import React, { useEffect, useState } from "react";
import { fetchMe } from "../api/memberApi"; // 경로는 실제 구조에 따라
import { MemberInfo } from "../types/dto";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ProfileEditPage = () => {
    const [formData, setFormData] = useState<MemberInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMe()
            .then(data => setFormData(data))
            .catch(err => setError("정보를 불러오지 못했습니다."));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            await api.put("/member/update", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            setSuccess(true);
            setTimeout(() => navigate("/"), 1000);
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
                    <label className="form-label">아이디 (수정 불가)</label>
                    <input className="form-control" value={formData.userId} disabled />
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
                <button type="submit" className="btn btn-primary">저장</button>
            </form>
        </div>
    );
};

export default ProfileEditPage;