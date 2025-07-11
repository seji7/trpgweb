import React, { useEffect, useState } from "react";
import { getRoomList, deleteRoom } from "../api/roomApi";
import { RoomResponse, MemberInfo } from "../types/dto";
import { Link } from "react-router-dom";
import { getLevelLabel } from "../utils/levelLabel";

// 게스트 접근 레벨 라벨
const guestAccessLabels = ["플레이 허용", "관전 허용", "입장 불가"];

// 상위에서 currentUser prop으로 받아온다고 가정
const RoomListPage = ({ currentUser }: { currentUser: MemberInfo | null }) => {
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<RoomResponse | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        getRoomList(0, 40)
            .then(res => setRooms(res.content || []))
            .catch(err => setError(err.response?.data?.message || "오류 발생"));
    }, []);

    // 삭제 버튼 노출 조건 (방장 or 관리자)
    const canDelete = (room: RoomResponse) =>
        currentUser &&
        (room.ownerMid === currentUser.mid || currentUser.userRole === "ADMIN");

    // 삭제 버튼 클릭
    const handleDeleteClick = (room: RoomResponse) => {
        setDeleteTarget(room);
        setModalOpen(true);
    };

    // 실제 삭제 실행
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteRoom(deleteTarget.rno);
            setRooms(rooms.filter(r => r.rno !== deleteTarget.rno));
        } catch (err: any) {
            setError(err.response?.data?.message || "삭제 실패");
        } finally {
            setModalOpen(false);
            setDeleteTarget(null);
        }
    };

    // 삭제 취소
    const handleModalClose = () => {
        setModalOpen(false);
        setDeleteTarget(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">방 목록</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {rooms.map(room => (
                    <div key={room.rno} className="col" style={{ position: "relative" }}>
                        {/* X 버튼: 방장 또는 관리자만 */}
                        {canDelete(room) && (
                            <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute"
                                style={{ top: 8, right: 12, zIndex: 10 }}
                                onClick={e => { e.preventDefault(); handleDeleteClick(room); }}
                                title="방 삭제"
                            >×</button>
                        )}
                        <Link to={`/rooms/${room.rno}/play`} className="text-decoration-none text-dark">
                            <div className="card h-100">
                                {room.thumbnailUrl && (
                                    <img
                                        src={room.thumbnailUrl}
                                        className="card-img-top"
                                        alt="썸네일"
                                        style={{ maxHeight: "200px", objectFit: "cover" }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{room.title}</h5>
                                    <p className="card-text">작성자: {room.ownerNickname}</p>
                                    <p className="card-text">
                                        <span className="badge bg-secondary me-2">
                                            {getLevelLabel(room.accountLevel)}
                                        </span>
                                        | 게스트 접근: <b>{guestAccessLabels[room.guestAccessLevel] ?? "미정"}</b>
                                    </p>
                                </div>
                                <div className="card-footer text-muted">
                                    최근 사용: {room.lastUsedAt}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* 모달(간단 구현) */}
            {modalOpen && deleteTarget && (
                <div className="modal show d-block" tabIndex={-1} style={{
                    background: "rgba(0,0,0,0.4)"
                }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">방 삭제 확인</h5>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <b>{deleteTarget.title}</b> 방을 정말 삭제하시겠습니까?<br />
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

export default RoomListPage;