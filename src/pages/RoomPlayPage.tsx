import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetail, deleteRoom } from "../api/roomApi";
import { MemberInfo, RoomResponse } from "../types/dto";

const RoomPlayPage = ({ currentUser }: { currentUser: MemberInfo | null }) => {
    const { rno } = useParams<{ rno: string }>();
    const navigate = useNavigate();

    const [room, setRoom] = useState<RoomResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

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

    const handleModalClose = () => setModalOpen(false);

    if (error) {
        return <div className="alert alert-danger mt-4 text-center">{error}</div>;
    }

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* 상단 바: 방 정보 + 삭제 버튼 */}
            <div
                style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid #ccc",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate(`/rooms/${rno}`)}
                >
                    방 정보 보기
                </button>
                {isOwnerOrAdmin && (
                    <button className="btn btn-danger btn-sm" onClick={handleDeleteClick}>
                        방 삭제
                    </button>
                )}
            </div>

            {/* 본 콘텐츠 */}
            <div style={{ flex: 1, display: "flex" }}>
                {/* 메인 화면 */}
                <div
                    style={{
                        flex: 4,
                        backgroundColor: "#e9ecef",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <p className="text-muted">[방 #{rno}] 플레이 공간 (준비 중)</p>
                </div>

                {/* 채팅창 */}
                <div
                    style={{
                        flex: 1,
                        borderLeft: "1px solid #ccc",
                        backgroundColor: "#f8f9fa",
                        padding: "1rem",
                        overflowY: "auto"
                    }}
                >
                    <h5>채팅</h5>
                    <div style={{ height: "100%", color: "#888" }}>
                        (채팅창 구현 예정)
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