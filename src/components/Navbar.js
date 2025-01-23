import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon-container">
          <FaGraduationCap className="logo-icon" />
        </div>
        <span className="logo-text">BlockDegrees</span>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
        <button className="connect-wallet">Connect Wallet</button>
      </ul>
    </nav>
  );
}

export default Navbar;
