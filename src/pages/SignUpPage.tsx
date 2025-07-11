import React, { useState } from "react";
import { registerMember } from "../api/memberApi";
import { MemberRegisterRequest, ErrorResponse } from "../types/dto";

const SignUpPage = () => {
    const [form, setForm] = useState<Omit<MemberRegisterRequest, "userRole">>({
        userId: "",
        password: "",
        username: "",
        nickname: "",
        userAddress: "",
        userPhone: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await registerMember({ ...form, userRole: "USER" });
            setSuccess("회원가입 성공! 로그인 해주세요.");
            setForm({
                userId: "",
                password: "",
                username: "",
                nickname: "",
                userAddress: "",
                userPhone: ""
            });
        } catch (err: any) {
            const res: ErrorResponse = err.response?.data;
            setError(res?.message || "오류 발생");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title mb-4">회원가입</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input className="form-control" name="userId" placeholder="아이디" value={form.userId} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <input className="form-control" name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <input className="form-control" name="username" placeholder="이름" value={form.username} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <input className="form-control" name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <input className="form-control" name="userAddress" placeholder="주소" value={form.userAddress} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <input className="form-control" name="userPhone" placeholder="전화번호" value={form.userPhone} onChange={handleChange} />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <button className="btn btn-primary w-100" type="submit">회원가입</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;