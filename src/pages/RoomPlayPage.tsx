import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetail } from "../api/roomApi";
import { MemberInfo, RoomResponse } from "../types/dto";

const RoomPlayPage = ({ currentUser }: { currentUser: MemberInfo | null }) => {
    const { rno } = useParams<{ rno: string }>();
    const navigate = useNavigate();

    const [room, setRoom] = useState<RoomResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!rno) return;
        getRoomDetail(Number(rno))
            .then(setRoom)
            .catch(err => setError(err.response?.data?.message || "오류 발생"));
    }, [rno]);

    const handleSend = () => {
        const msg = inputRef.current?.value?.trim();
        if (msg) {
            setLogs(prev => [...prev, msg]);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    if (error) {
        return <div className="alert alert-danger mt-4 text-center">{error}</div>;
    }

    return (
        <div className="vh-100 d-flex flex-column">
            {/* 상단 고정 헤더 */}
            <div
                className="d-flex align-items-center justify-content-between px-3 py-2 bg-dark text-white"
                style={{ height: "48px", zIndex: 1030, cursor: "pointer" }}
            >
                <span
                    className="fw-bold"
                    onClick={() => navigate("/rooms")}
                    style={{ userSelect: "none" }}
                >
                    TRPG Web - {room?.title ?? "방"}
                </span>
                <div>
                    <button className="btn btn-sm btn-outline-light me-2" onClick={() => navigate(`/rooms/${rno}`)}>
                        방 정보
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => navigate("/rooms")}>
                        나가기
                    </button>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                {/* 좌측: 맵 공간 */}
                <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-body-secondary">
                    <p className="text-muted m-0">[방 #{rno}] 플레이 공간 (준비 중)</p>
                </div>

                {/* 우측: 채팅창 */}
                <div
                    className="d-flex flex-column border-start bg-white"
                    style={{
                        width: "300px",
                        minWidth: "220px",
                        resize: "horizontal",
                        overflow: "auto",
                        padding: "0.75rem"
                    }}
                >
                    <h5 className="mb-3">채팅</h5>
                    <div className="flex-grow-1 overflow-auto mb-2" style={{ minHeight: 0 }}>
                        {logs.map((line, idx) => (
                            <div key={idx} className="text-secondary small mb-1">
                                {line}
                            </div>
                        ))}
                    </div>
                    <div className="d-flex align-items-end">
                        <textarea
                            className="form-control me-2"
                            style={{ height: "3rem", resize: "none" }}
                            onKeyDown={handleKeyPress}
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            placeholder="메시지 입력"
                        />
                        <button
                            className="btn btn-primary"
                            style={{ height: "3rem", lineHeight: "1.2rem" }}
                            onClick={handleSend}
                        >
                            Send
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RoomPlayPage;