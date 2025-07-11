import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetail, deleteRoom } from "../api/roomApi";
import { RoomResponse, MemberInfo } from "../types/dto";
import { getLevelLabel } from "../utils/levelLabel";

const guestAccessLabels = ["플레이 허용", "관전 허용", "입장 불가"];

const RoomDetailPage = ({ currentUser }: { currentUser: MemberInfo | null }) => {
    const { rno } = useParams<{ rno: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<RoomResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 🔥 모달용 state 추가
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!rno) return;
        getRoomDetail(Number(rno))
            .then(setRoom)
            .catch(err => setError(err.response?.data?.message || "오류 발생"));
    }, [rno]);

    // 방장 또는 관리자 권한 체크
    const isOwnerOrAdmin =
        currentUser &&
        room &&
        (room.ownerMid === currentUser.mid || currentUser.userRole === "ADMIN");

    // 🔥 삭제 버튼 → 모달 오픈
    const handleDeleteClick = () => setModalOpen(true);

    // 🔥 모달 내에서 실제 삭제
    const handleDeleteConfirm = async () => {
        try {
            await deleteRoom(Number(rno));
            navigate("/rooms");
        } catch (err: any) {
            setError(err.response?.data?.message || "삭제 실패");
        } finally {
            setModalOpen(false);
        }
    };
    const handleModalClose = () => setModalOpen(false);

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!room) return <div className="alert alert-info">로딩 중...</div>;

    return (
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <div className="card">
                {room.thumbnailUrl && (
                    <img
                        src={room.thumbnailUrl}
                        alt="썸네일"
                        className="card-img-top"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                )}
                <div className="card-body">
                    <h3 className="card-title">{room.title}</h3>
                    <p className="card-text">방장: {room.ownerNickname}</p>
                    <p className="card-text">설명: {room.description}</p>
                    <p className="card-text">
                        등급: <span className="badge bg-secondary">{getLevelLabel(room.accountLevel)}</span>
                    </p>
                    <p className="card-text">
                        게스트 접근: <b>{guestAccessLabels[room.guestAccessLevel] ?? "미정"}</b>
                    </p>
                    <p className="card-text">생성일: {room.createdAt}</p>
                </div>
                {isOwnerOrAdmin && (
                    <div className="card-footer text-end">
                        {/* 🔥 삭제 버튼: onClick에 handleDeleteClick 사용 */}
                        <button className="btn btn-danger" onClick={handleDeleteClick}>
                            방 삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 🔥 모달 컴포넌트 추가 */}
            {modalOpen && (
                <div className="modal show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">방 삭제 확인</h5>
                            </div>
                            <div className="modal-body">
                                <p>
                                    정말 이 방을 삭제하시겠습니까?<br />
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

export default RoomDetailPage;