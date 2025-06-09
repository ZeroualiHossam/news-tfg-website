import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Sobre este proyecto</h3>
          <p>
            Este proyecto es una demo de una galería de noticias construida con React,  
            React Router y consumo de APIs.  
          </p>
        </div>
        <div className="footer-section info">
          <h3>Información</h3>
          <ul>
            <li><a href="/about">Acerca de mí</a></li>
            <li><a href="/contact">Contacto</a></li>
            <li><a href="/privacy">Política de privacidad</a></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Sígueme</h3>
          <div className="social-links">
            <a href="https://github.com/tuUsuario" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://twitter.com/tuUsuario" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com/in/tuUsuario" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Tu Nombre. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
