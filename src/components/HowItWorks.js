import React from 'react';
import { FaGraduationCap, FaLock, FaCheckCircle, FaExchangeAlt } from 'react-icons/fa';
import '../styles/HowItWorks.css';

function HowItWorks() {
  const steps = [
    {
      title: "Issuance",
      description: "Educational institutions mint your degree as a secure, unique token on the blockchain",
      Icon: FaGraduationCap
    },
    {
      title: "Ownership",
      description: "Your degree is stored in your blockchain wallet, giving you full ownership and control",
      Icon: FaLock
    },
    {
      title: "Verification",
      description: "Employers can verify your degree instantly using its unique token ID",
      Icon: FaCheckCircle
    },
    {
      title: "Sharing",
      description: "Easily share your credentials with anyone, anywhere",
      Icon: FaExchangeAlt
    }
  ];

  return (
    <section className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-container">
        {steps.map((step, index) => {
          const IconComponent = step.Icon;
          return (
            <div key={index} className="step-card">
              <IconComponent className="step-icon" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;
