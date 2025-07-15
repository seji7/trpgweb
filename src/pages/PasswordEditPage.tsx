import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const PasswordEditPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await api.put("/member/update-password", {
                currentPassword,
                newPassword
            }, { withCredentials: true });

            setSuccess(true);
            setTimeout(() => navigate("/"), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "비밀번호 변경 실패");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">비밀번호 변경</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">비밀번호가 변경되었습니다.</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">현재 비밀번호</label>
                    <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">새 비밀번호</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">새 비밀번호 확인</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">변경</button>
            </form>
        </div>
    );
};

export default PasswordEditPage;