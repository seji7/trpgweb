// 회원가입 DTO (변경 없음)
export interface MemberRegisterRequest {
    userId: string;
    password: string;
    username: string;
    nickname: string;
    userAddress: string;
    userPhone: string;
    userRole: string;
}

// 로그인 DTO (변경 없음)
export interface LoginRequest {
    username: string; // userId와 동일하게 사용
    password: string;
}

// 방 생성 DTO (premium 제거)
export interface RoomRegisterRequest {
    title: string;
    description: string;
    guestAccessLevel: number;
    accountLevel: number;
    thumbnail: File | null;
}

// 방 목록/상세 DTO (premium 제거, accountLevel 추가)
export interface RoomResponse {
    rno: number;
    title: string;
    description: string;
    ownerNickname: string;
    ownerMid: number;           // 빠졌으면 추가
    guestAccessLevel: number;
    createdAt: string;
    lastUsedAt: string;
    thumbnailUrl: string;
    accountLevel: number;       // ★ 등급 추가
}

// 플레이어 초대 DTO (변경 없음)
export interface AddPlayerRequest {
    username: string;
    ownerMid: number;
}

// 에러 응답 (변경 없음)
export interface ErrorResponse {
    code: string;
    message: string;
}

// 세션 유지, 내 정보 DTO (accountLevel 추가)
export interface MemberInfo {
    mid: number;
    userId: string;
    username: string;
    nickname: string;
    userRole: string;
    accountLevel: number;       // ★ 등급 추가
}