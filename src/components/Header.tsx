import { Link, useNavigate } from "react-router-dom";
import { MemberInfo } from "../types/dto";
import { logout } from "../api/memberApi";

interface HeaderProps {
    currentUser: MemberInfo | null;
    setCurrentUser: (user: MemberInfo | null) => void;
}

const Header = ({ currentUser, setCurrentUser }: HeaderProps) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            setCurrentUser(null);
            navigate("/login");
        } catch (err) {
            console.error("로그아웃 실패:", err);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <Link to="/" className="navbar-brand">
                TRPG Web
            </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {currentUser ? (
                        <>
                            <li className="nav-item">
                                <span className="nav-link active">
                                    <strong>{currentUser.nickname}</strong>님 환영합니다
                                </span>
                            </li>
                            <li className="nav-item">
                                <Link to="/rooms" className="nav-link">방 목록</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/room/create" className="nav-link">방 생성</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link to="/signup" className="nav-link">회원가입</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">로그인</Link>
                            </li>
                        </>
                    )}
                </ul>
                {currentUser && (
                    <div className="d-flex align-items-center ms-auto">
                        <Link
                            to="/profile-edit"
                            className="btn btn-outline-primary btn-sm me-2"
                            style={{ minWidth: 80 }}
                        >
                            정보수정
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="btn btn-outline-danger btn-sm"
                            style={{ minWidth: 80, marginLeft: "8px" }}
                        >
                            로그아웃
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;