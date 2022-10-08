import React from "react";
import { Routes, Route } from "react-router-dom";
import { Main, Join } from "./pages";

function AppIndex() {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
      <Route exact path="join" element={<Join />} />
    </Routes>
  );
}

export default AppIndex;
