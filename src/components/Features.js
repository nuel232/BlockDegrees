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
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    tokenId: "",
    studentName: "",
    matricNumber: "",
    grade: "",
    department: "",
    faculty: "",
    issueDate: "",
    year: "",
  });
  const [revokeTokenId, setRevokeTokenId] = useState("");
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
      onClick: () => setShowIssueModal(true),
    },
    {
      title: "Revoke Degree by Universities",
      description: "Universities can revoke degrees from students",
      Icon: FaGraduationCap,
      onClick: () => setShowRevokeModal(true),
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

  const generateMetadata = () => {
    const metadata = {
      name: `Bachelor of Science in ${formData.department} - ${formData.studentName}`,
      description: `This certifies that ${formData.studentName}, with Matriculation Number ${formData.matricNumber}, has successfully completed the prescribed course of study in ${formData.department} under the Faculty of ${formData.faculty} at Veritas University, Abuja, and has been duly awarded the degree of Bachelor of Science (B.Sc.) in accordance with the university's regulations. Congratulations on this academic achievement!`,
      image:
        "https://ipfs.io/ipfs/bafybeibukfbp4iqdc6la4zzkwrnblbkupbx4vzuqa3rgnokkrhdv6g7uji",
      attributes: [
        {
          trait_type: "Degree Type",
          value: "Undergraduate",
        },
        {
          trait_type: "Student Name",
          value: formData.studentName,
        },
        {
          trait_type: "Matric Number",
          value: formData.matricNumber,
        },
        {
          trait_type: "Grade",
          value: formData.grade,
        },
        {
          trait_type: "Department",
          value: formData.department,
        },
        {
          trait_type: "Faculty",
          value: formData.faculty,
        },
        {
          trait_type: "Issue Date",
          value: formData.issueDate,
        },
        {
          trait_type: "Year",
          value: formData.year,
        },
      ],
    };

    return JSON.stringify(metadata);
  };

  const handleRevoke = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { signer } = await walletService.connectMetaMask();

      if (!signer) {
        throw new Error(
          "Failed to get signer. Please try reconnecting your wallet."
        );
      }

      const contract = await walletService.getContract(
        CONTRACT_ADDRESS,
        DegreeToken
      );

      console.log("Contract instance created:", contract);

      // Call the contract's revokeDegree function
      const tx = await contract.revokeDegree(revokeTokenId);
      console.log("Transaction sent:", tx);

      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      setShowRevokeModal(false);
      setRevokeTokenId("");
      alert("Degree revoked successfully!");
    } catch (err) {
      console.error("Error revoking degree:", err);
      if (err.code === "ACTION_REJECTED") {
        setError("Transaction was rejected by user");
      } else if (err.message.includes("user rejected")) {
        setError("You rejected the connection request");
      } else {
        setError(err.message || "Failed to revoke degree. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { signer } = await walletService.connectMetaMask();

      if (!signer) {
        throw new Error(
          "Failed to get signer. Please try reconnecting your wallet."
        );
      }

      const metadata = generateMetadata();
      // Here you would typically upload the metadata to IPFS first
      // and use the returned IPFS hash as the metadata URI
      const metadataUri = "ipfs://YOUR_IPFS_HASH"; // Replace with actual IPFS upload

      const contract = await walletService.getContract(
        CONTRACT_ADDRESS,
        DegreeToken
      );

      console.log("Contract instance created:", contract);

      const tx = await contract.issueDegree(
        formData.address,
        formData.tokenId,
        metadataUri
      );

      console.log("Transaction sent:", tx);
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      setShowIssueModal(false);
      setFormData({
        address: "",
        tokenId: "",
        studentName: "",
        matricNumber: "",
        grade: "",
        department: "",
        faculty: "",
        issueDate: "",
        year: "",
      });

      alert("Degree issued successfully!");
    } catch (err) {
      console.error("Error issuing degree:", err);
      setError(err.message || "Failed to issue degree. Please try again.");
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

      {showIssueModal && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowIssueModal(false)}
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
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Student Name"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="matricNumber"
                  value={formData.matricNumber}
                  onChange={handleInputChange}
                  placeholder="Matriculation Number"
                  required
                />
              </div>

              <div className="form-group">
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="First Class">First Class</option>
                  <option value="Second Class Upper">Second Class Upper</option>
                  <option value="Second Class Lower">Second Class Lower</option>
                  <option value="Third Class">Third Class</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Department"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  placeholder="Faculty"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Year"
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

      {showRevokeModal && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowRevokeModal(false)}
            >
              <FaTimes />
            </button>
            <h2>Revoke Degree</h2>
            <p>Enter the Token ID of the degree to revoke</p>

            <form onSubmit={handleRevoke} className="revoke-form">
              <div className="form-group">
                <input
                  type="text"
                  value={revokeTokenId}
                  onChange={(e) => {
                    setRevokeTokenId(e.target.value);
                    setError("");
                  }}
                  placeholder="Token ID"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Revoking..." : "Revoke Degree"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Features;
