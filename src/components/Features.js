import React from 'react';
import { FaLink, FaCheckCircle, FaGlobe } from 'react-icons/fa';
import '../styles/Features.css';

function Features() {
  const features = [
    {
      title: "Blockchain-Powered Degrees",
      description: "Every degree is tokenized into a unique, non-fungible token (NFT) that guarantees its authenticity",
      Icon: FaLink
    },
    {
      title: "Instant Verification",
      description: "Employers and institutions can verify certificates in seconds, eliminating fraud",
      Icon: FaCheckCircle
    },
    {
      title: "Global Access",
      description: "Your credentials are stored on the blockchain, accessible anytime, anywhere",
      Icon: FaGlobe
    }
  ];

  return (
    <section className="features">
      <h2>Key Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => {
          const IconComponent = feature.Icon;
          return (
            <div key={index} className="feature-card">
              <IconComponent className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Features;
