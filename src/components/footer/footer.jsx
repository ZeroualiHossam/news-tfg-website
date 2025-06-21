import './footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Hossam Zerouali.
      </div>
    </footer>
  );
};

export default Footer;
