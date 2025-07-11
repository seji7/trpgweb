import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import RoomListPage from "./pages/RoomListPage";
import RoomCreatePage from "./pages/RoomCreatePage";
import RoomDetailPage from "./pages/RoomDetailPage";
import RoomPlayPage from "./pages/RoomPlayPage";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { fetchMe } from "./api/memberApi";
import { MemberInfo } from "./types/dto";

function AppWrapper() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<MemberInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then(user => setCurrentUser(user))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, []);

  const isPlayPage = location.pathname.includes("/rooms/") && location.pathname.includes("/play");

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isPlayPage && <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      <div className={isPlayPage ? "" : "container mt-4"}>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
          <Route path="/rooms" element={<RoomListPage currentUser={currentUser} />} />
          <Route path="/room/create" element={<RoomCreatePage />} />
          <Route path="/rooms/:rno" element={<RoomDetailPage currentUser={currentUser} />} />
          <Route path="/rooms/:rno/play" element={<RoomPlayPage currentUser={currentUser} />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}