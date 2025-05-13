import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import MainPageVideo from './pages/MainPageVideo';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPageVideo />} />
        <Route path="/grupo/:groupId" element={<NewsPage />} />
      </Routes>
    </Router>
  );
}
