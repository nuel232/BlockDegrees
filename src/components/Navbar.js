import React from "react";
import { FaGraduationCap, FaWallet } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar({ isWalletConnected, userAddress, connectWallet }) {
  // Function to truncate the wallet address
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon-container">
          <FaGraduationCap className="logo-icon" />
        </div>
        <span className="logo-text">BlockDegrees</span>
      </div>
      <ul className="nav-links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          {isWalletConnected ? (
            <div className="wallet-info">
              <FaWallet className="wallet-icon" />
              <span className="wallet-address">
                {truncateAddress(userAddress)}
              </span>
            </div>
          ) : (
            <button className="connect-wallet" onClick={connectWallet}>
              <FaWallet className="wallet-icon" />
              Connect Wallet
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
