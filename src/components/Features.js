import React, { useState, useRef, useEffect } from "react";
import {
  FaLink,
  FaCheckCircle,
  FaGlobe,
  FaGraduationCap,
  FaTimes,
  FaFileUpload,
} from "react-icons/fa";
import { walletService } from "../services/WalletService";
import DegreeToken from "../abi/degree.json";
import "../styles/Features.css";

function Features() {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showBatchIssueModal, setShowBatchIssueModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [batchError, setBatchError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
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
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const CONTRACT_ADDRESS = "0x18B700395ae2DE3742D9f997D4cAF28ebf302a93";
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
      title: "Issue Transcript by Universities",
      description:
        "Universities can issue transcript to students and store them on the blockchain",
      Icon: FaGraduationCap,
      onClick: () => setShowTranscriptModal(true),
    },
    {
      title: "Revoke Degree by Universities",
      description: "Universities can revoke degrees from students",
      Icon: FaGraduationCap,
      onClick: () => setShowRevokeModal(true),
    },
    {
      title: "Batch Issue Degrees",
      description: "Issue multiple degrees at once using CSV upload",
      Icon: FaFileUpload,
      onClick: () => setShowBatchIssueModal(true),
    },
  ];

  const issueModalRef = useRef(null);
  const revokeModalRef = useRef(null);
  const transcriptModalRef = useRef(null);
  const batchModalRef = useRef(null);

  // Close modal on outside click and manage body scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (issueModalRef.current && !issueModalRef.current.contains(event.target)  &&
      event.target.classList.contains('modal')) {
        setShowIssueModal(false);
      }
      if (revokeModalRef.current && !revokeModalRef.current.contains(event.target)) {
        setShowRevokeModal(false);
      }
      if (transcriptModalRef.current && !transcriptModalRef.current.contains(event.target)) {
        setShowTranscriptModal(false);
      }
      if (batchModalRef.current && !batchModalRef.current.contains(event.target)) {
        setShowBatchIssueModal(false);
      }
    };

    const handleBodyScroll = (e) => {
      if (!e.target.closest('.modal-content')) {
        e.preventDefault();
      }
    };
  
    if (showIssueModal || showRevokeModal || showTranscriptModal || showBatchIssueModal) {
      document.body.classList.add("modal-open");
      document.addEventListener("mousedown", handleClickOutside);
      // Only prevent scrolling on the background
      document.body.addEventListener("wheel", handleBodyScroll, { passive: false });
      document.body.addEventListener("touchmove", handleBodyScroll, { passive: false });
    } else {
      document.body.classList.remove("modal-open");
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.removeEventListener("wheel", handleBodyScroll);
      document.body.removeEventListener("touchmove", handleBodyScroll);
    };
  }, [showIssueModal, showRevokeModal, showTranscriptModal, showBatchIssueModal]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleTranscriptSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Generate metadata object for transcript
      const metadata = {
        name: `Official Academic Transcript - ${formData.studentName}`,
        description: `This NFT serves as a unique and verifiable record of ${formData.studentName}'s academic accomplishments at Veritas University. It includes all courses completed, grades achieved, and the date of graduation. Stored on the blockchain for security and immutability. This NFT contains an academic transcript.`,
        image:
          "https://ipfs.io/ipfs/bafybeiecfkxzkbzonu53k7eb47fa7pelpj3rxmkqwyx3qof5yapofgcbqa",
        pdf: "https://ipfs.io/ipfs/bafkreiagsumonuapp7quct6aptqoplvufwssthpwa7loozpboxrmuyv44q",
        attributes: [
          {
            trait_type: "Student Name",
            value: formData.studentName,
          },
          {
            trait_type: "Matric Number",
            value: formData.matricNumber,
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

      // Convert metadata to URI format
      const metadataUri = `data:application/json;base64,${btoa(
        JSON.stringify(metadata)
      )}`;
      console.log("Transcript Metadata URI:", metadataUri);

      // Get contract instance
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

      // Call the contract's issueTranscript function (assuming it exists)
      const tx = await contract.issueDegree(
        formData.address,
        formData.tokenId,
        metadataUri
      );

      console.log("Transaction sent:", tx);
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      setShowTranscriptModal(false);
      setFormData({
        address: "",
        tokenId: "",
        studentName: "",
        matricNumber: "",
        department: "",
        faculty: "",
        issueDate: "",
        year: "",
      });

      showSuccess("Transcript issued successfully!");
    } catch (err) {
      console.error("Error issuing transcript:", err);
      if (err.code === "ACTION_REJECTED") {
        setError("Transaction was rejected by user");
      } else if (err.message.includes("user rejected")) {
        setError("You rejected the connection request");
      } else {
        setError(
          err.message || "Failed to issue transcript. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
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
      showSuccess("Degree revoked successfully!");
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
      // Generate metadata object
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

      // Convert metadata to URI format
      const metadataUri = `data:application/json;base64,${btoa(
        JSON.stringify(metadata)
      )}`;
      console.log("Metadata URI:", metadataUri);

      // Get contract instance
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

      // Call the contract's issueDegree function with the metadata URI
      const tx = await contract.issueDegree(
        formData.address,
        formData.tokenId,
        metadataUri // Pass the metadata URI directly
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

      showSuccess("Degree issued successfully!");
    } catch (err) {
      console.error("Error issuing degree:", err);
      setError(err.message || "Failed to issue degree. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target.result;
          const rows = text.split('\n').filter(row => row.trim());
          const headers = rows[0].split(',');
          const degrees = rows.slice(1).map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim();
              return obj;
            }, {});
          });
          setCsvFile(degrees);
          setBatchError("");
        } catch (error) {
          setBatchError("Error processing CSV file");
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBatchIssuance = async () => {
    if (!csvFile || csvFile.length === 0) {
      setBatchError("Please upload a valid CSV file");
      return;
    }

    setIsProcessing(true);
    setProcessedCount(0);
    setBatchError("");

    try {
      const contract = await walletService.getContract(CONTRACT_ADDRESS, DegreeToken);

      for (const degree of csvFile) {
        try {
          const metadata = {
            name: `Degree Certificate - ${degree.studentName}`,
            description: `Official degree certificate for ${degree.studentName}`,
            attributes: [
              { trait_type: "Student Name", value: degree.studentName },
              { trait_type: "Matric Number", value: degree.matricNumber },
              { trait_type: "Grade", value: degree.grade },
              { trait_type: "Department", value: degree.department },
              { trait_type: "Faculty", value: degree.faculty },
              { trait_type: "Issue Date", value: degree.issueDate },
              { trait_type: "Year", value: degree.year }
            ]
          };

          const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
          
          const tx = await contract.issueDegree(
            degree.walletAddress,
            degree.tokenId,
            metadataUri
          );
          await tx.wait();
          setProcessedCount(prev => prev + 1);
        } catch (error) {
          console.error(`Error issuing degree for ${degree.studentName}:`, error);
        }
      }
      setShowBatchIssueModal(false);
    } catch (error) {
      setBatchError("Error in batch processing");
      console.error(error);
    } finally {
      setIsProcessing(false);
      if (processedCount > 0) {
        showSuccess(`Successfully issued ${processedCount} degrees`);
        setShowBatchIssueModal(false);
        setCsvFile(null);
        setProcessedCount(0);
      }
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
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
          <div className="modal-content" ref={issueModalRef}>
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
          <div className="modal-content" ref={revokeModalRef}>
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

      {showTranscriptModal && (
        <div className="modal">
          <div className="modal-content" ref={transcriptModalRef}>
            <button
              className="close-button"
              onClick={() => setShowTranscriptModal(false)}
            >
              <FaTimes />
            </button>
            <h2>Issue New Transcript</h2>
            <p>Enter the details to issue a new transcript NFT</p>

            <form onSubmit={handleTranscriptSubmit} className="issue-form">
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
                {isLoading ? "Issuing..." : "Issue Transcript"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showBatchIssueModal && (
        <div className="modal">
          <div className="modal-content" ref={batchModalRef}>
            <button className="close-button" onClick={() => setShowBatchIssueModal(false)}>
              <FaTimes />
            </button>
            <h2>Batch Issue Degrees</h2>
            <p>Upload a CSV file containing degree information</p>

            <div className="batch-upload-container">
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="file-input"
              />
              
              {csvFile && (
                <div className="batch-summary">
                  <p>Records to process: {csvFile.length}</p>
                  {isProcessing && (
                    <div className="processing-status">
                      <p>Processing... {processedCount}/{csvFile.length}</p>
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{width: `${(processedCount/csvFile.length) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {batchError && <div className="error-message">{batchError}</div>}

              <button
                className="submit-button"
                onClick={handleBatchIssuance}
                disabled={!csvFile || isProcessing}
              >
                {isProcessing ? "Processing..." : "Issue Degrees"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessAnimation && (
        <div className="success-animation">
          <div className="success-icon">
            <FaCheckCircle size={40} color="#FFFFFF" />
          </div>
          <div className="success-message">{successMessage}</div>
        </div>
      )}
    </section>
  );
}

export default Features;
