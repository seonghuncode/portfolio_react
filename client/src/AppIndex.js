import React from "react";
import { Routes, Route } from "react-router-dom";
import { Main } from "./pages";

function AppIndex() {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
    </Routes>
  );
}

export default AppIndex;
