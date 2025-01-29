import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { BrowserProvider, Contract, Interface } from 'ethers';
import DegreeToken from '../abi/anything.json';
import '../styles/Hero.css';

function Hero() {
  const [tokenId, setTokenId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const checkTokenExists = async (tokenId) => {
    if (!window.ethereum) {
      setError('Please install MetaMask to verify tokens');
      return false;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      
      // Make sure we're using the ABI array directly
      const contractABI = Array.isArray(DegreeToken) ? DegreeToken : DegreeToken.abi;
      
      // Create interface first to ensure ABI is properly formatted
      const contractInterface = new Interface(contractABI);
      
      const contract = new Contract(
        '0x70dFeB66b08625d7aEac0C16D3e1EDd389247f90',
        contractInterface,
        provider
      );

      // Try to get the metadata for the token
      const metadata = await contract.getDegreeMetadata(tokenId);
      
      // If metadata exists and is not empty/null, token is valid
      return metadata && metadata !== '';
    } catch (error) {
      console.error('Error checking token:', error);
      // More specific error handling
      if (error.message.includes('call revert exception')) {
        setError('Token ID does not exist');
      } else if (error.message.includes('invalid address')) {
        setError('Invalid contract address');
      } else {
        setError('Error verifying token. Please try again.');
      }
      return false;
    }
  };

  const handleViewDegree = async () => {
    if (tokenId.trim()) {
        try {
            console.log("Token ID:", tokenId);
            // Check if the token exists before fetching metadata
            const exists = await checkTokenExists(tokenId);
            if (!exists) {
                setError('Token ID does not exist.');
                return;
            }

            // Fetch degree metadata
            const metadata = await checkTokenExists(tokenId);
            if (!metadata) {
                setError('No metadata found for this token ID.');
                return;
            }

            navigate(`/degree/${tokenId}`); // Navigate to DegreeDetails page with tokenId
            setShowModal(false);
        } catch (error) {
            console.error('Error checking token:', error);
            setError('Error checking token. Please try again.');
        }
    } else {
        setError('Please enter a token ID');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setError('');
    setTokenId('');
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
                onChange={(e) => {
                  setTokenId(e.target.value);
                  setError(''); // Clear error when user types
                }}
                placeholder="Enter Token ID"
                className={`token-input ${error ? 'error' : ''}`}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <button 
              className="view-degree-btn" 
              onClick={handleViewDegree} 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'View My Degree'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;