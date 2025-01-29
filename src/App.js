import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DegreeDetails from './components/DegreeDetails';
import 'font-awesome/css/font-awesome.min.css';
import { BrowserProvider, Contract} from 'ethers';
import DegreeToken from './abi/anything.json'; // Adjust the path as necessary

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try{
        const provider = new BrowserProvider (window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setUserAddress(address);

        const contractAddress = '0x70dFeB66b08625d7aEac0C16D3e1EDd389247f90'; // Replace with your contract address
        const contract = new Contract(contractAddress, DegreeToken, signer);
        setContract(contract);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      } 
    }else {
        console.log('Please install MetaMask!');
      }
    };

    connectWallet();
  }, []);

  const issueDegree = async (recipient, tokenId, metadataURI) => {
    if (contract) {
      try {
        const tx = await contract.issueDegree(recipient, tokenId, metadataURI);
        await tx.wait(); // Wait for the transaction to be mined
        console.log('Degree issued successfully!');
      } catch (error) {
        console.error('Error issuing degree:', error);
      }
    }
  };

  const getDegreeMetadata = async (tokenId) => {
    if (contract) {
      try {
        const metadata = await contract.getDegreeMetadata(tokenId);
        console.log('Degree Metadata:', metadata);
        return metadata;
      } catch (error) {
        console.error('Error fetching degree metadata:', error);
      }
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <HowItWorks />
              <Testimonials />
            </>
          } />
          <Route path="/degree/:tokenId" element={<DegreeDetails />} />
        </Routes>
        <Footer />
        <div>
          <h1>Welcome to BlockDegrees</h1>
          <p>Your address: {userAddress}</p>

          <h2>Issue Degree</h2>
          <input type="text" placeholder="Recipient Address" id="recipient" />
          <input type="number" placeholder="Token ID" id="tokenId" />
          <input type="text" placeholder="Metadata URI" id="metadataURI" />
          <button onClick={() => issueDegree(document.getElementById('recipient').value, document.getElementById('tokenId').value, document.getElementById('metadataURI').value)}>
            Issue Degree
          </button>

          <h2>Get Degree Metadata</h2>
          <input type="number" placeholder="Token ID" id="getTokenId" />
          <button onClick={() => getDegreeMetadata(document.getElementById('getTokenId').value)}>
            Get Metadata
          </button>
        </div>
      </div>
    </Router>
  );
}

export default App;
