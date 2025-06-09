// src/components/Layout.js
import { Link } from 'react-router-dom';
import './Layout.css';
import ToggleViewSwitch from './ToggleViewSwitch';

export default function Layout({ children }) {
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">NEWS TFG</Link>
        <nav className="nav-with-toggle">
          <ToggleViewSwitch />
        </nav>
      </header>
      <main className="main-container">
        {children}
      </main>
    </>
  );
}
