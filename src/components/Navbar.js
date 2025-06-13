import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaWallet, FaBars, FaTimes, FaArrowUp } from "react-icons/fa";
import { walletService } from "../services/WalletService";
import "../styles/Navbar.css";

function Navbar() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    if (walletService.isConnected()) {
      setIsWalletConnected(true);
      setUserAddress(walletService.getAddress());
    }

    // Listen for account changes
    walletService.listenToAccountChanges((address) => {
      setIsWalletConnected(!!address);
      setUserAddress(address || "");
    });

    // Add scroll event listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to truncate the wallet address
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { address } = await walletService.connectMetaMask();
      setIsWalletConnected(true);
      setUserAddress(address);
    } catch (error) {
      setError(error.message);
      console.error("Error connecting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setError("");
      await walletService.disconnect();
      setIsWalletConnected(false);
      setUserAddress("");
    } catch (error) {
      setError(error.message);
      console.error("Error disconnecting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon-container">
            <FaGraduationCap className="logo-icon" />
          </div>
          <span className="logo-text">BlockDegrees</span>
        </div>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>Home</a>
          </li>
          <li>
            <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('features'); }}>Features</a>
          </li>
          <li>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('how-it-works'); }}>About</a>
          </li>
          <li>
            {isWalletConnected ? (
              <div className="wallet-container">
                <div className="wallet-info">
                  <FaWallet className="wallet-icon" />
                  <span className="wallet-address">
                    {truncateAddress(userAddress)}
                  </span>
                </div>
                <button
                  className="disconnect-wallet-btn"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  {isLoading ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            ) : (
              <button
                className="connect-wallet"
                onClick={handleConnect}
                disabled={isLoading}
              >
                <FaWallet className="wallet-icon" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </li>
        </ul>
        {error && <div className="wallet-error">{error}</div>}
      </nav>

      {showScrollTop && (
        <button 
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}

      {isMobileMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
