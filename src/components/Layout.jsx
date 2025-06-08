// src/components/Layout.js
import React from 'react';
import ToggleViewSwitch from './ToggleViewSwitch';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <>
      <header className="header">
        <div className="logo">NEWS TFG</div>
        <nav className="nav-with-toggle">
          {/* Aquí podrías añadir más enlaces si los necesitas */}
          <ToggleViewSwitch />
        </nav>
      </header>
      <main className="main-container">
        {children}
      </main>
    </>
  );
}
