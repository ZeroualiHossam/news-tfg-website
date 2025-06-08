// src/components/ToggleViewSwitch.js
import React from 'react';
import { BookOpen, Video } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ToggleViewSwitch.css';

const ToggleViewSwitch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isVideo = location.pathname === '/video';

  const handleToggle = () => {
    navigate(isVideo ? '/' : '/video');
  };

  return (
    <div className="toggle-switch" onClick={handleToggle}>
      <BookOpen className={`icon ${!isVideo ? 'active' : ''}`} />
      <div className={`slider ${isVideo ? 'video' : 'image'}`}>
        <div className="thumb" />
      </div>
      <Video className={`icon ${isVideo ? 'active' : ''}`} />
    </div>
  );
};

export default ToggleViewSwitch;
