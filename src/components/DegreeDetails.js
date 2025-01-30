import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";
import "../styles/DegreeDetails.css";
import { BrowserProvider, Contract, Interface } from "ethers";
import DegreeToken from "../abi/degree.json";

function DegreeDetails() {
  const { tokenId } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [contractAddress, setContractAddress] = useState("");

  const getIPFSUrl = (ipfsUri) => {
    if (!ipfsUri) return "";
    // Replace ipfs:// with IPFS gateway URL
    return ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/");
  };

  useEffect(() => {
    const fetchDegreeMetadata = async () => {
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

        // Store contract address
        setContractAddress(contract.target);

        try {
          await contract.ownerOf(tokenId);
          const metadataURI = await contract.tokenURI(tokenId);

          // Convert IPFS URI to HTTP URL
          const httpUrl = getIPFSUrl(metadataURI);

          // Fetch and parse the JSON metadata
          const response = await fetch(httpUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch metadata");
          }

          const jsonMetadata = await response.json();

          // Convert any IPFS image URLs in the metadata
          if (jsonMetadata.image && jsonMetadata.image.startsWith("ipfs://")) {
            jsonMetadata.image = getIPFSUrl(jsonMetadata.image);
          }

          setMetadata(jsonMetadata);
        } catch (contractError) {
          if (contractError.message.includes("ERC721NonexistentToken")) {
            setError(
              "This degree certificate does not exist. Please check the token ID."
            );
          } else if (contractError.message.includes("NotOwner")) {
            setError(
              "You are not authorized to view this certificate's details."
            );
          } else {
            setError("Error fetching degree details. Please try again.");
          }
          console.error("Contract error:", contractError);
        }
      } catch (error) {
        setError(
          "Error connecting to blockchain. Please ensure your wallet is connected."
        );
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tokenId) {
      fetchDegreeMetadata();
    }
  }, [tokenId]);

  if (isLoading) {
    return (
      <div className="degree-details loading">
        <div className="loading-spinner"></div>
        <p>Loading degree details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="degree-details error">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.history.back()} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="degree-details error">
        <div className="error-container">
          <h2>No Data Found</h2>
          <p>No degree metadata found for this token ID.</p>
          <button onClick={() => window.history.back()} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get attribute value
  const getAttribute = (traitType) => {
    return (
      metadata.attributes.find((attr) => attr.trait_type === traitType)
        ?.value || ""
    );
  };

  return (
    <div className="degree-details">
      <div className="degree-image">
        <img src={metadata.image} alt="Graduation Cap on Book" />
      </div>

      <div className="degree-content">
        <div className="left-content">
          <h1>{metadata.name}</h1>
          <p className="mint-date">
            Issue Date:{" "}
            {new Date(getAttribute("Issue Date")).toLocaleDateString()}
          </p>

          <div className="section">
            <h2>Created By</h2>
            <div className="university">
              <img src="/veritas-logo.jpg" alt="Veritas University" />
              <span>Veritas University Abuja</span>
            </div>
          </div>

          <div className="section">
            <h2>Description</h2>
            <p className="description">{metadata.description}</p>
            <p className="congratulations">
              Congratulations on this academic achievement! This NFT serves as
              an immutable record of your educational accomplishment.
            </p>
          </div>

          <div className="section">
            <h2>Certificate Details</h2>
            <div className="attributes-grid">
              <div className="attribute">
                <span className="attribute-trait">Student Name</span>
                <span className="attribute-value">
                  {getAttribute("Student Name")}
                </span>
              </div>
              <div className="attribute">
                <span className="attribute-trait">Matric Number</span>
                <span className="attribute-value">
                  {getAttribute("Matric Number")}
                </span>
              </div>
              <div className="attribute">
                <span className="attribute-trait">Grade</span>
                <span className="attribute-value">{getAttribute("Grade")}</span>
              </div>
              <div className="attribute">
                <span className="attribute-trait">Department</span>
                <span className="attribute-value">
                  {getAttribute("Department")}
                </span>
              </div>
              <div className="attribute">
                <span className="attribute-trait">Faculty</span>
                <span className="attribute-value">
                  {getAttribute("Faculty")}
                </span>
              </div>
              <div className="attribute">
                <span className="attribute-trait">Degree Type</span>
                <span className="attribute-value">
                  {getAttribute("Degree Type")}
                </span>
              </div>
              <div className="attribute">
                <span className="attribute-trait">Year</span>
                <span className="attribute-value">{getAttribute("Year")}</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>View On Chain</h2>
            <div className="opensea-link">
              <FaGlobe className="globe-icon" />
              <a
                href={`https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on OpenSea
              </a>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => window.history.back()} className="back-button">
        Go Back
      </button>
    </div>
  );
}

export default DegreeDetails;
