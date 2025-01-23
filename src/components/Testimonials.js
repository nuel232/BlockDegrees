import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import '../styles/Testimonials.css';

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideClass, setSlideClass] = useState('slide-in-right');
  
  const testimonials = [
    {
      name: "John Smith",
      role: "HR Manager at Microsoft",
      icon: <FaUserCircle />,
      text: "BlockDegrees has revolutionized our hiring process. Verifying academic credentials is now instant and trustworthy. This platform has saved us countless hours in background checks."
    },
    {
      name: "Sarah Johnson",
      role: "Dean at Harvard University",
      icon: <FaUserCircle />,
      text: "As an educational institution, we're excited about the potential of blockchain-verified degrees. It's not just about preventing fraud; it's about empowering our graduates with portable, verifiable credentials."
    },
    {
      name: "Michael Chen",
      role: "Recent Graduate",
      icon: <FaUserCircle />,
      text: "Having my degree as an NFT is incredible! I can share my credentials with employers instantly, and they can verify its authenticity in seconds. The future of education is here."
    },
    {
      name: "Emma Williams",
      role: "Talent Acquisition Lead at Google",
      icon: <FaUserCircle />,
      text: "BlockDegrees has streamlined our recruitment process significantly. The ability to instantly verify academic credentials has made hiring faster and more reliable."
    },
    {
      name: "Dr. James Wilson",
      role: "University Registrar",
      icon: <FaUserCircle />,
      text: "This platform has transformed how we issue and manage academic credentials. The blockchain technology ensures absolute security and transparency."
    },
    {
      name: "Lisa Anderson",
      role: "Education Technology Consultant",
      icon: <FaUserCircle />,
      text: "BlockDegrees represents a significant leap forward in credential verification. It's exciting to see blockchain technology being applied so effectively in education."
    },
    {
      name: "John Abel",
      role: "Student",
      icon: <FaUserCircle />,
      text: "I Can Now Share My Degree With Confidence. No More Worrying About Lost Transcripts!"
    }
  ];

  const nextSlide = () => {
    setSlideClass('slide-out-left');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setSlideClass('slide-in-right');
    }, 500);
  };

  const prevSlide = () => {
    setSlideClass('slide-out-right');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setSlideClass('slide-in-left');
    }, 500);
  };

  return (
    <section className="testimonials">
      <div className="testimonials-header">
        <h2>Testimonials</h2>
        <p>What our users are saying about BlockDegrees</p>
      </div>

      <div className="testimonials-slider">
        <button className="slider-button prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>

        <div className={`testimonial-card ${slideClass}`}>
          <div className="testimonial-header">
            <span className="author-icon">{testimonials[currentIndex].icon}</span>
            <div className="testimonial-info">
              <h3>{testimonials[currentIndex].name}</h3>
              <p className="role">{testimonials[currentIndex].role}</p>
            </div>
          </div>
          <p className="testimonial-text">{testimonials[currentIndex].text}</p>
        </div>

        <button className="slider-button next" onClick={nextSlide}>
          <FaChevronRight />
        </button>
      </div>

      <div className="slider-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
