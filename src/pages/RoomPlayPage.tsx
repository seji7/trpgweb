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
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!rno) return;

        let socket: WebSocket;

        getRoomDetail(Number(rno))
            .then(setRoom)
            .catch(err => setError(err.response?.data?.message || "오류 발생"));

        socket = new WebSocket(`ws://localhost:8080/ws/chat/${rno}`);

        socket.onopen = () => {
            console.log("WebSocket 연결됨");
            socketRef.current = socket; // ← 연결된 후에만 할당
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const formatted = `[${data.senderId}] ${data.content}`;
                setLogs(prev => [...prev, formatted]);
            } catch (e) {
                console.warn("JSON parse 실패:", event.data);
                setLogs(prev => [...prev, event.data]);
            }
        };

        socket.onerror = (e) => {
            console.error("WebSocket 오류", e);
        };

        socket.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        return () => {
            console.log("WebSocket 클린업");
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [rno]);

    const handleSend = () => {
        const el = inputRef.current;
        const msg = el?.value.trim();
        if (!msg || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

        const payload = {
            senderId: currentUser?.mid,
            content: msg,
            timestamp: new Date().toISOString()
        };

        socketRef.current.send(JSON.stringify(payload));
        if (el) el.value = "";
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (error) {
        return <div className="alert alert-danger mt-4 text-center">{error}</div>;
    }

    return (
        <div className="vh-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-dark text-white"
                style={{ height: "48px", zIndex: 1030, cursor: "pointer" }}>
                <span className="fw-bold" onClick={() => navigate("/rooms")} style={{ userSelect: "none" }}>
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

            <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-body-secondary">
                    <p className="text-muted m-0">[방 #{rno}] 플레이 공간 (준비 중)</p>
                </div>

                <div className="d-flex flex-column border-start bg-white"
                    style={{
                        width: "300px",
                        minWidth: "220px",
                        resize: "horizontal",
                        overflow: "auto",
                        padding: "0.75rem"
                    }}>
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
                            ref={inputRef}
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