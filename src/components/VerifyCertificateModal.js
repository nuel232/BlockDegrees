import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const VerifyCertificateModal = ({ showModal, handleClose, onVerify }) => {
    const [tokenId, setTokenId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        if (!tokenId) {
            setError('Please enter a Token ID');
            return;
        }
        setError('');
        setIsLoading(true);
        
        try {
            await onVerify(tokenId); // Call the verification function passed as a prop
            handleClose(); // Close the modal after verification
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!showModal) return null; // Don't render the modal if it's not open

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={handleClose}>
                    <FaTimes />
                </button>
                <h2>Verify Your Certificate</h2>
                <p className="modal-subtitle">Please Provide Your Token ID To Verify Your Certificate.</p>
                
                <div className="token-input-container">
                    <input 
                        type="text" 
                        value={tokenId}
                        onChange={(e) => {
                            setTokenId(e.target.value);
                            setError(''); // Clear error when user types
                        }}
                        placeholder="Enter Token ID (e.g., 6834)"
                        className={`token-input ${error ? 'error' : ''}`}
                        disabled={isLoading}
                    />
                    {error && <div className="error-message">{error}</div>}
                </div>

                <button 
                    className="view-degree-btn" 
                    onClick={handleVerify}
                    disabled={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Verify Certificate'}
                </button>
            </div>
        </div>
    );
};

export default VerifyCertificateModal; 