import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MasonryGrid from "./components/MasonryGrid";
import PhotoDetail from "./components/PhotoDetails";
import styled from "styled-components";

const StyledHeader = styled.h1`
  padding: 10px;
  text-align: center;
`;

const Button = styled.button``;

function App() {
  return (
    <Router>
      <StyledHeader>Photo Grid</StyledHeader>
      <Routes>
        <Route path="/" element={<MasonryGrid />} />
        <Route path="/photo/:photoId" element={<PhotoDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
