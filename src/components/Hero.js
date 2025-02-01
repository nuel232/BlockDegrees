import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEthereum, FaCheckCircle } from "react-icons/fa";
import { BrowserProvider, Contract, Interface } from "ethers";
import DegreeToken from "../abi/degree.json";
import "../styles/Hero.css";

function Hero() {
  const [tokenId, setTokenId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const verifyModalRef = useRef();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        verifyModalRef.current &&
        !verifyModalRef.current.contains(event.target)
      ) {
        handleVerifyClose();
      }
    };

    if (showVerifyModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVerifyModal]);

  const handleViewDegreeClick = () => {
    setShowModal(true);
    setError("");
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      setError("");
      setTokenId("");
    }, 300);
  };

  const handleVerifyClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowVerifyModal(false);
      setVerificationResult(null);
      setError("");
      setIsClosing(false);
    }, 300);
  };

  const handleVerifyCertificate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const tokenId = e.target.verifyTokenId.value;
      const provider = new BrowserProvider(window.ethereum);
      const contractABI = Array.isArray(DegreeToken)
        ? DegreeToken
        : DegreeToken.abi;
      const contractInterface = new Interface(contractABI);

      const contract = new Contract(
        "0x70dFeB66b08625d7aEac0C16D3e1EDd389247f90",
        contractInterface,
        provider
      );

      try {
        await contract.ownerOf(tokenId);
        const metadata = await contract.tokenURI(tokenId);
        setVerificationResult(metadata);
      } catch (contractError) {
        if (contractError.message.includes("ERC721NonexistentToken")) {
          setError(
            "This certificate ID does not exist. Please check the ID and try again."
          );
        } else if (contractError.message.includes("NotOwner")) {
          setError(
            "You are not authorized to view this certificate's details."
          );
        } else {
          setError("Error verifying certificate. Please try again.");
        }
        console.error("Contract error:", contractError);
      }
    } catch (error) {
      setError(
        "Error connecting to blockchain. Please ensure your wallet is connected."
      );
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDegree = async () => {
    if (!tokenId.trim()) {
      setError("Please enter a token ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const contractABI = Array.isArray(DegreeToken)
        ? DegreeToken
        : DegreeToken.abi;
      const contractInterface = new Interface(contractABI);

      const contract = new Contract(
        "0x70dFeB66b08625d7aEac0C16D3e1EDd389247f90",
        contractInterface,
        provider
      );

      const metadata = await contract.tokenURI(tokenId);
      if (metadata) {
        navigate(`/degree/${tokenId}`);
        handleClose();
      } else {
        setError("No degree found for this token ID");
      }
    } catch (error) {
      console.error("Error viewing degree:", error);
      setError(
        "Error viewing degree. Please check the token ID and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleViewDegree();
    }
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Own Your Academic Achievements On The Blockchain</h1>
        <p>
          A Secure, Transparent, And Tamper-Proof System For Educational Degrees
          And Transcripts, Built On ERC-721 Blockchain Technology.
        </p>

        <div className="action-buttons">
          <button className="view-degree" onClick={handleViewDegreeClick}>
            View My Degree
          </button>
          <button
            className="verify-certificate"
            onClick={() => setShowVerifyModal(true)}
          >
            Verify a Certificate
          </button>
        </div>
      </div>

      <div className="hero-image-container">
        <div className="hero-image">
          <img
            src="/degree-nft.png"
            alt="Degree NFT with graduation cap on book"
          />
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
        <div className={`modal ${isClosing ? "closing" : ""}`}>
          <div className="modal-content" ref={modalRef}>
            <button className="close-button" onClick={handleClose}>
              <FaTimes />
            </button>
            <h2>Enter Your Certificate Token ID</h2>
            <p className="modal-subtitle">
              Please provide your token ID to access your certificate.
            </p>

            <div className="token-input-container">
              <input
                type="text"
                value={tokenId}
                onChange={(e) => {
                  setTokenId(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter Token ID"
                className={`token-input ${error ? "error" : ""}`}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <button
              className="view-degree-btn"
              onClick={handleViewDegree}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "View My Degree"}
            </button>
          </div>
        </div>
      )}

      {showVerifyModal && (
        <div className={`modal ${isClosing ? "closing" : ""}`}>
          <div className="modal-content" ref={verifyModalRef}>
            <button className="close-button" onClick={handleVerifyClose}>
              <FaTimes />
            </button>

            <h2>Verify Academic Certificate</h2>
            <p className="modal-subtitle">
              Enter the certificate's Token ID to verify its authenticity
            </p>

            {!verificationResult ? (
              <form onSubmit={handleVerifyCertificate}>
                <div className="token-input-container">
                  <input
                    type="number"
                    name="verifyTokenId"
                    placeholder="Enter Token ID"
                    className={`token-input ${error ? "error" : ""}`}
                    required
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>

                <button
                  type="submit"
                  className="verify-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Certificate"}
                </button>
              </form>
            ) : (
              <div className="verification-result">
                <div className="success-icon">
                  <FaCheckCircle className="check-icon" />
                </div>
                <h3>Certificate Verified!</h3>
                <div className="metadata-display">
                  <p>Certificate Details:</p>
                  <pre>{JSON.stringify(verificationResult, null, 2)}</pre>
                </div>
                <div className="action-buttons">
                  <button
                    onClick={() => navigate(`/degree/${tokenId}`)}
                    className="view-details-btn"
                  >
                    View Full Details
                  </button>
                  <button
                    onClick={() => {
                      setVerificationResult(null);
                      setError(""); 
                    }}
                    className="verify-another-btn"
                  >
                    Verify Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && !showModal && !showVerifyModal && (
        <div className="error-toast">{error}</div>
      )}
    </div>
  );
}

export default Hero;
