import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import MainPageVideos from './pages/MainPageVideo';
import NewsPage from './pages/NewsPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/video" element={<MainPageVideos />} />
          <Route path="/grupo/:group_id" element={<NewsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
