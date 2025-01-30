import React, { useState } from "react";
import {
  FaLink,
  FaCheckCircle,
  FaGlobe,
  FaGraduationCap,
  FaTimes,
} from "react-icons/fa";
import { walletService } from "../services/WalletService";
import DegreeToken from "../abi/degree.json";
import "../styles/Features.css";

function Features() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    tokenId: "",
    metadata: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const CONTRACT_ADDRESS = "0x70dFeB66b08625d7aEac0C16D3e1EDd389247f90";
  const features = [
    {
      title: "Blockchain-Powered Degrees",
      description:
        "Every degree is tokenized into a unique, non-fungible token (NFT) that guarantees its authenticity",
      Icon: FaLink,
    },
    {
      title: "Instant Verification",
      description:
        "Employers and institutions can verify certificates in seconds, eliminating fraud",
      Icon: FaCheckCircle,
    },
    {
      title: "Global Access",
      description:
        "Your credentials are stored on the blockchain, accessible anytime, anywhere",
      Icon: FaGlobe,
    },
    {
      title: "Issue Degree by Universities",
      description:
        "Universities can issue degrees to students and store them on the blockchain",
      Icon: FaGraduationCap,
      onClick: () => setShowModal(true),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Force reconnect to ensure we have a fresh signer
      const { signer } = await walletService.connectMetaMask();

      if (!signer) {
        throw new Error(
          "Failed to get signer. Please try reconnecting your wallet."
        );
      }

      // Get contract instance with the fresh signer
      const contract = await walletService.getContract(
        CONTRACT_ADDRESS,
        DegreeToken
      );

      console.log("Contract instance created:", contract);

      // Call the contract's issueDegree function
      const tx = await contract.issueDegree(
        formData.address,
        formData.tokenId,
        formData.metadata
      );

      console.log("Transaction sent:", tx);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      // Reset form and close modal
      setShowModal(false);
      setFormData({ address: "", tokenId: "", metadata: "" });

      // Show success message
      alert("Degree issued successfully!");
    } catch (err) {
      console.error("Error issuing degree:", err);
      if (err.code === "ACTION_REJECTED") {
        setError("Transaction was rejected by user");
      } else if (err.message.includes("user rejected")) {
        setError("You rejected the connection request");
      } else {
        setError(err.message || "Failed to issue degree. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="features">
      <h2>Key Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => {
          const IconComponent = feature.Icon;
          return (
            <div
              key={index}
              className="feature-card"
              onClick={feature.onClick}
              style={{ cursor: feature.onClick ? "pointer" : "default" }}
            >
              <IconComponent className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>
            <h2>Issue New Degree</h2>
            <p>Enter the details to issue a new degree NFT</p>

            <form onSubmit={handleSubmit} className="issue-form">
              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Student Wallet Address"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="tokenId"
                  value={formData.tokenId}
                  onChange={handleInputChange}
                  placeholder="Token ID"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="metadata"
                  value={formData.metadata}
                  onChange={handleInputChange}
                  placeholder="Metadata URI"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Issuing..." : "Issue Degree"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Features;
