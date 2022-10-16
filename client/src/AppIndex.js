import React from "react";
import { Routes, Route } from "react-router-dom";
import { Main, Join, Login } from "./pages";

//페이지 경로 설정을 해주는 페이지
function AppIndex() {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
      <Route exact path="join" element={<Join />} />

      <Route exaxt path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppIndex;
