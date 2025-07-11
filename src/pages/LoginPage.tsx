import React, { useState } from "react";
import { login, fetchMe } from "../api/memberApi";
import { ErrorResponse, MemberInfo } from "../types/dto";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
    setCurrentUser: (user: MemberInfo | null) => void;
}

const LoginPage = ({ setCurrentUser }: LoginPageProps) => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(form);
            const user = await fetchMe();
            setCurrentUser(user);
            navigate("/rooms");
        } catch (err: any) {
            const res: ErrorResponse = err.response?.data;
            setError(res?.message || "로그인 실패");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4 text-center">로그인</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        name="username"
                        placeholder="아이디"
                        className="form-control"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        className="form-control"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">로그인</button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;