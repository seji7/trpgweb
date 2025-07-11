import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetail, deleteRoom } from "../api/roomApi";
import { MemberInfo, RoomResponse } from "../types/dto";

const RoomPlayPage = ({ currentUser }: { currentUser: MemberInfo | null }) => {
    const { rno } = useParams<{ rno: string }>();
    const navigate = useNavigate();

    const [room, setRoom] = useState<RoomResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!rno) return;
        getRoomDetail(Number(rno))
            .then(setRoom)
            .catch(err => setError(err.response?.data?.message || "오류 발생"));
    }, [rno]);

    const isOwnerOrAdmin =
        currentUser &&
        room &&
        (room.ownerMid === currentUser.mid || currentUser.userRole === "ADMIN");

    const handleDeleteClick = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const handleDeleteConfirm = async () => {
        if (!room) return;
        try {
            await deleteRoom(room.rno);
            navigate("/rooms");
        } catch (err: any) {
            setError(err.response?.data?.message || "삭제 실패");
        } finally {
            setModalOpen(false);
        }
    };

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
            {/* 상단 버튼 바 */}
            <div className="d-flex justify-content-between align-items-center border-bottom bg-light p-2">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/rooms/${rno}`)}>
                    방 정보 보기
                </button>
                {isOwnerOrAdmin && (
                    <button className="btn btn-danger btn-sm" onClick={handleDeleteClick}>
                        방 삭제
                    </button>
                )}
            </div>

            {/* 메인 컨텐츠 영역 */}
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
                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control form-control-sm me-2"
                            onKeyDown={handleKeyPress}
                            ref={inputRef}
                            placeholder="메시지 입력"
                        />
                        <button className="btn btn-sm btn-primary" onClick={handleSend}>전송</button>
                    </div>
                </div>
            </div>

            {/* 삭제 모달 */}
            {modalOpen && room && (
                <div className="modal show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">방 삭제 확인</h5>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <b>{room.title}</b> 방을 정말 삭제하시겠습니까?<br />
                                    이 작업은 되돌릴 수 없습니다.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleModalClose}>취소</button>
                                <button className="btn btn-danger" onClick={handleDeleteConfirm}>삭제</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomPlayPage;