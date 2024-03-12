import React from 'react';
import '../footer.css'

const Footer = () => {
  return (
    <footer id="footer" className="py-5 bg-dark" style={{ gridRow: 'footer' }}>
      <div className="container px-4 px-lg-5">
        <p className="m-0 text-center text-white">Copyright &copy; WhereToGo?</p>
      </div>
    </footer>
  );
};

export default Footer;
