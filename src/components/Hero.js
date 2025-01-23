import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import '../styles/Hero.css';

function Hero() {
  const [tokenId, setTokenId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleViewDegree = () => {
    if (tokenId.trim()) {
      navigate(`/degree/${tokenId}`);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Own Your Academic Achievements On The Blockchain</h1>
        <p>A Secure, Transparent, And Tamper-Proof System For Educational Degrees And Transcripts, Built On ERC-721 Blockchain Technology.</p>
        
        <div className="action-buttons">
          <button className="view-degree" onClick={() => setShowModal(true)}>
            View My Degree
          </button>
          <button className="verify-certificate">
            Verify a Certificate
          </button>
        </div>
      </div>

      <div className="hero-image-container">
        <div className="hero-image">
          <img src="/degree-nft.png" alt="Degree NFT with graduation cap on book" />
        </div>
        <div className="nft-info">
          <h3>DegreeNFT</h3>
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="username">Animakid</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            <button className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>
            <h2>Each Certificate Is Linked To A Unique Token ID.</h2>
            <p className="modal-subtitle">Please Provide Your Token ID To Access Your Certificate.</p>
            
            <div className="token-input-container">
              <input 
                type="text" 
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Enter Token ID"
                className="token-input"
              />
            </div>

            <button className="view-degree-btn" onClick={handleViewDegree}>
              View My Degree
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
