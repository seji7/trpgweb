import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../api/roomApi";
import { RoomRegisterRequest, ErrorResponse } from "../types/dto";

const guestAccessOptions = [
    { value: 0, label: "게스트 플레이 허용" },
    { value: 1, label: "게스트 관전 허용" },
    { value: 2, label: "게스트 입장 불가" },
];

const accountLevelOptions = [
    { value: 0, label: "일반" },
    { value: 1, label: "스페셜" },
    { value: 2, label: "VIP" },
];

const RoomCreatePage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<Omit<RoomRegisterRequest, "thumbnail" | "ownerMid">>({
        title: "",
        description: "",
        guestAccessLevel: 0,
        accountLevel: 0,
    });

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "guestAccessLevel" || name === "accountLevel"
                ? Number(value)
                : value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnail(e.target.files?.[0] ?? null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await createRoom({ ...form, thumbnail });
            const rno = response.rno;
            navigate(`/rooms/${rno}`);
        } catch (err: any) {
            const res: ErrorResponse = err.response?.data;
            setError(res?.message || "오류 발생");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <h2 className="mb-4 text-center">방 만들기</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">방 제목</label>
                    <input
                        name="title"
                        className="form-control"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">설명</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">게스트 접근 레벨</label>
                    <select
                        name="guestAccessLevel"
                        className="form-select"
                        value={form.guestAccessLevel}
                        onChange={handleChange}
                        required
                    >
                        {guestAccessOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">계정 등급</label>
                    <select
                        name="accountLevel"
                        className="form-select"
                        value={form.accountLevel}
                        onChange={handleChange}
                        required
                    >
                        {accountLevelOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">썸네일 이미지</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-grid">
                    <button type="submit" className="btn btn-success">방 만들기</button>
                </div>
            </form>
        </div>
    );
};

export default RoomCreatePage;