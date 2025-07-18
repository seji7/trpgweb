import api from "./axiosInstance";
import { RoomRegisterRequest, AddPlayerRequest, ChatMessage } from "../types/dto";

// 방 생성 (multipart/form-data)
export const createRoom = async (data: RoomRegisterRequest) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("guestAccessLevel", String(data.guestAccessLevel));
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    const res = await api.post("/room/register-room", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

// 방 목록
export const getRoomList = async (page: number, size: number) => {
    const res = await api.get("/room/list-data", {
        params: { page, size }
    });
    console.log("room list res", res);
    return res.data; // Page<RoomResponse>
};

// 방 상세
export const getRoomDetail = async (rno: number) => {
    const res = await api.get(`/room/detail-data/${rno}`);
    return res.data;
};

// 플레이어 초대
export const addPlayer = async (rno: number, data: AddPlayerRequest) => {
    const res = await api.post(`/room/${rno}/add-player`, data);
    return res.data;
};

// 방 삭제
export const deleteRoom = async (rno: number) => {
    return await api.delete(`/room/delete/${rno}`);
};

// 채팅 누적 저장
export const getRoomLogs = async (roomId: number): Promise<ChatMessage[]> => {
    const res = await api.get(`/api/messages/${roomId}`);
    console.log("과거 로그", res.data);
    return res.data.data;
};