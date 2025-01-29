import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaGlobe } from 'react-icons/fa';
import '../styles/DegreeDetails.css';
import { BrowserProvider, Contract } from 'ethers';
import DegreeToken from '../abi/anything.json';

function DegreeDetails() {
  const { tokenId } = useParams();
  const [timeLeft, setTimeLeft] = useState({
    hours: 59,
    minutes: 59,
    seconds: 59
  });
  const [degreeMetadata, setDegreeMetadata] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newSeconds = prevTime.seconds - 1;
        const newMinutes = newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
        const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;

        if (newHours < 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          hours: newHours,
          minutes: newMinutes < 0 ? 59 : newMinutes,
          seconds: newSeconds < 0 ? 59 : newSeconds
        };
      });
    }, 1000);

    const fetchDegreeMetadata = async () => {
      try {
        // Connect to Ethereum provider
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Create contract instance
        const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
        const contract = new Contract(contractAddress, DegreeToken.abi, signer);

        // Fetch degree metadata
        const metadata = await contract.getDegreeMetadata(tokenId);
        setDegreeMetadata(metadata);
      } catch (err) {
        setError('Failed to fetch degree metadata. Please check the token ID.');
        console.error(err);
      }
    };

    fetchDegreeMetadata();

    return () => {
      clearInterval(timer);
    };
  }, [tokenId]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div className="degree-details">
      <div className="degree-image">
        <img src="/degree-nft.png" alt="Graduation Cap on Book" />
      </div>

      <div className="degree-content">
        <div className="left-content">
          <h1>Bachelor Of Science In Computer Science</h1>
          <p className="mint-date">Minted On January 11, 2025</p>

          <div className="section">
            <h2>Created By</h2>
            <div className="university">
            <img src="/veritas-logo.jpg" alt="Veritas University" />
            <span>Veritas University Abuja</span>
            </div>
          </div>

          <div className="section">
            <h2>Description</h2>
            <p className="description">
              This certifies that <span className="highlight">John Doe</span>, with Matriculation Number <span className="highlight">VUC/CSC/21/5100</span>, has successfully completed the prescribed course of study in Computer Science under the Faculty of Natural and Applied Sciences at Veritas University, Abuja, and has been duly awarded the degree of Bachelor of Science (B.Sc.) in accordance with the university's regulations. This degree represents the successful completion of a rigorous academic program that includes comprehensive study in computer programming, software development, database management, artificial intelligence, and other key areas of computer science. The recipient has demonstrated exceptional academic performance and practical skills throughout the program.
            </p>
            <p className="congratulations">
              Congratulations on this academic achievement! This NFT serves as an immutable record of your educational accomplishment.
            </p>
          </div>

          <div className="section">
            <h2>Details</h2>
            <div className="opensea-link">
              <FaGlobe className="globe-icon" />
              <span>View on OpenSea</span>
            </div>
          </div>
        </div>

        <div className="right-content">
          <div className="auction-timer">
            <p>Auction ends in:</p>
            <div className="timer">
              <div className="time-block">
                <span className="time">{formatTime(timeLeft.hours)}</span>
                <span className="label">Hours</span>
              </div>
              <span className="separator">:</span>
              <div className="time-block">
                <span className="time">{formatTime(timeLeft.minutes)}</span>
                <span className="label">Minutes</span>
              </div>
              <span className="separator">:</span>
              <div className="time-block">
                <span className="time">{formatTime(timeLeft.seconds)}</span>
                <span className="label">Seconds</span>
              </div>
            </div>
            <button className="place-bid">Place Bid</button>
          </div>
        </div>
      </div>

      {error && <p>{error}</p>}
      {degreeMetadata && (
        <div>
          <h3>Degree Metadata:</h3>
          <p>{degreeMetadata}</p>
        </div>
      )}
    </div>
  );
}

export default DegreeDetails; 