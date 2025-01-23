import React from 'react';
import { FaCube, FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="logo-section">
            <FaCube className="logo-icon" />
            <h3>BlockDegrees</h3>
          </div>
          <p>Blockchain-powered certificate verification interface</p>
          <p>Join our community</p>
          <div className="social-icons">
            <a href="/social/facebook"><FaFacebook className="social-icon" /></a>
            <a href="/social/linkedin"><FaLinkedin className="social-icon" /></a>
            <a href="/social/twitter"><FaTwitter className="social-icon" /></a>
            <a href="/social/instagram"><FaInstagram className="social-icon" /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Explore</h3>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#degrees">View Degrees</a></li>
            <li><a href="#verify">Verify Certificates</a></li>
            <li><a href="#wallet">Connect Wallet</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email:</p>
          <p className="contact-detail">blockdegrees2024@gmail.com</p>
          <p>Phone:</p>
          <p className="contact-detail">091 234 5674</p>
          <p className="contact-detail">090 678 8891</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 BlockDegrees. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
