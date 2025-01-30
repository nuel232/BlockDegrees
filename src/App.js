import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import DegreeDetails from "./components/DegreeDetails";
import "font-awesome/css/font-awesome.min.css";
import { BrowserProvider, Contract } from "ethers";
import DegreeToken from "./abi/degree.json"; // Adjust the path as necessary

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            connectWallet();
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          setProvider(null);
          setSigner(null);
          setContract(null);
          setUserAddress("");
          setIsWalletConnected(false);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setUserAddress(address);
        setIsWalletConnected(true);

        const contractAddress = "0xefd592f2EB7806c7ecfD9E5019043AC4412107E9";
        const contract = new Contract(contractAddress, DegreeToken, signer);
        setContract(contract);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const issueDegree = async (recipient, tokenId, metadataURI) => {
    if (!contract) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.issueDegree(recipient, tokenId, metadataURI);
      await tx.wait();
      console.log("Degree issued successfully!", tx.hash);
    } catch (error) {
      setError(error.message || "Error issuing degree");
      console.error("Error issuing degree:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDegreeMetadata = async (tokenId) => {
    if (!contract) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const metadata = await contract.getDegreeMetadata(tokenId);
      console.log("Degree Metadata:", metadata);
      return metadata;
    } catch (error) {
      setError(error.message || "Error fetching degree metadata");
      console.error("Error fetching degree metadata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const revokeDegree = async (tokenId) => {
    if (!contract) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.revokeDegree(tokenId);
      await tx.wait();
      console.log("Degree revoked successfully!", tx.hash);
    } catch (error) {
      setError(error.message || "Error revoking degree");
      console.error("Error revoking degree:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const transferDegree = async (to, tokenId) => {
    if (!contract) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.transferDegree(to, tokenId);
      await tx.wait();
      console.log("Degree transferred successfully!", tx.hash);
    } catch (error) {
      setError(error.message || "Error transferring degree");
      console.error("Error transferring degree:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateDegree = async (owner, tokenId) => {
    if (!contract) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await contract.validateDegree(owner, tokenId);
      console.log("Degree validation result:", result);
      return result;
    } catch (error) {
      setError(error.message || "Error validating degree");
      console.error("Error validating degree:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDegreeMetadata = async (tokenId, newMetadataURI) => {
    if (!contract) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.updateDegreeMetadata(tokenId, newMetadataURI);
      await tx.wait();
      console.log("Degree metadata updated successfully!", tx.hash);
    } catch (error) {
      setError(error.message || "Error updating degree metadata");
      console.error("Error updating degree metadata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          isWalletConnected={isWalletConnected}
          userAddress={userAddress}
          connectWallet={connectWallet}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero
                  isWalletConnected={isWalletConnected}
                  connectWallet={connectWallet}
                />
                <Features />
                <HowItWorks />
                <Testimonials />
              </>
            }
          />
          <Route path="/degree/:tokenId" element={<DegreeDetails />} />
        </Routes>
        <Footer />
        <div>
          <h1>Welcome to BlockDegrees</h1>
          <p>Your address: {userAddress}</p>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <h2>Issue Degree</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const recipient = e.target.recipient.value;
              const tokenId = e.target.tokenId.value;
              const metadataURI = e.target.metadataURI.value;
              issueDegree(recipient, tokenId, metadataURI);
            }}
          >
            <input
              type="text"
              name="recipient"
              placeholder="Recipient Address"
              required
            />
            <input
              type="number"
              name="tokenId"
              placeholder="Token ID"
              required
            />
            <input
              type="text"
              name="metadataURI"
              placeholder="Metadata URI"
              required
            />
            <button type="submit" disabled={isLoading || !isWalletConnected}>
              {isLoading ? "Processing..." : "Issue Degree"}
            </button>
          </form>

          <h2>Get Degree Metadata</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const metadata = await getDegreeMetadata(
                e.target.getTokenId.value
              );
            }}
          >
            <input
              type="number"
              name="getTokenId"
              placeholder="Token ID"
              required
            />
            <button type="submit" disabled={isLoading || !isWalletConnected}>
              {isLoading ? "Loading..." : "Get Metadata"}
            </button>
          </form>

          <h2>Revoke Degree</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const tokenId = e.target.revokeTokenId.value;
              revokeDegree(tokenId);
            }}
          >
            <input
              type="number"
              name="revokeTokenId"
              placeholder="Token ID"
              required
            />
            <button type="submit" disabled={isLoading || !isWalletConnected}>
              {isLoading ? "Processing..." : "Revoke Degree"}
            </button>
          </form>

          <h2>Transfer Degree</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const to = e.target.transferTo.value;
              const tokenId = e.target.transferTokenId.value;
              transferDegree(to, tokenId);
            }}
          >
            <input
              type="text"
              name="transferTo"
              placeholder="Recipient Address"
              required
            />
            <input
              type="number"
              name="transferTokenId"
              placeholder="Token ID"
              required
            />
            <button type="submit" disabled={isLoading || !isWalletConnected}>
              {isLoading ? "Processing..." : "Transfer Degree"}
            </button>
          </form>

          <h2>Validate Degree</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const owner = e.target.validateOwner.value;
              const tokenId = e.target.validateTokenId.value;
              const result = await validateDegree(owner, tokenId);
              // You might want to display the result somewhere in your UI
            }}
          >
            <input
              type="text"
              name="validateOwner"
              placeholder="Owner Address"
              required
            />
            <input
              type="number"
              name="validateTokenId"
              placeholder="Token ID"
              required
            />
            <button type="submit" disabled={isLoading || !isWalletConnected}>
              {isLoading ? "Validating..." : "Validate Degree"}
            </button>
          </form>

          <h2>Update Degree Metadata</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const tokenId = e.target.updateTokenId.value;
              const newMetadataURI = e.target.newMetadataURI.value;
              updateDegreeMetadata(tokenId, newMetadataURI);
            }}
          >
            <input
              type="number"
              name="updateTokenId"
              placeholder="Token ID"
              required
            />
            <input
              type="text"
              name="newMetadataURI"
              placeholder="New Metadata URI"
              required
            />
            <button type="submit" disabled={isLoading || !isWalletConnected}>
              {isLoading ? "Updating..." : "Update Metadata"}
            </button>
          </form>
        </div>
      </div>
    </Router>
  );
}

export default App;
