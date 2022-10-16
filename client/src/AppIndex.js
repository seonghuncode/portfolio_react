import React from "react";
import { Routes, Route } from "react-router-dom";
import { Main, Join, Login1, Join1, Main1 } from "./pages";

//페이지 경로 설정을 해주는 페이지
function AppIndex() {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
      <Route exact path="join" element={<Join />} />

      <Route exaxt path="/login" element={<Login1 />} />
      {/* <Route exaxt path="/join" element={<Join1 />} />
      <Route exaxt path="/main" element={<Main1 />} /> */}
    </Routes>
  );
}

export default AppIndex;
