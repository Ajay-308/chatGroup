"use client"
import React from 'react';
import MainForm from './component/MainRoom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoom from './component/Room';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center">
      <Router>
        <Routes>
          <Route index element={<MainForm />} />
          <Route path="chat/:roomId" element={<ChatRoom />} />
          <Route path="*" element={<h1>No match</h1>} />
        </Routes>
      </Router>
    </div>
  );
};

export default Home;
