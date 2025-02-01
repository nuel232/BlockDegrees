import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/Testimonials.css";

// Sample data for testimonials
const testimonials = [
  {
    id: 1,
    icon: "icon1",
    content:
      "The blockchain degree verification system has revolutionized how I share my credentials. It's secure, instant, and truly innovative!",
    author: "Sarah Johnson",
    position: "Software Engineer",
  },
  {
    id: 2,
    icon: "icon2",
    content:
      "As an employer, this platform makes verifying candidates' degrees incredibly efficient. No more waiting for traditional verification methods.",
    author: "Michael Chen",
    position: "HR Director",
  },
  {
    id: 3,
    icon: "icon3",
    content:
      "The transparency and immutability of blockchain technology gives me confidence that my academic achievements are securely recorded.",
    author: "Emma Williams",
    position: "Recent Graduate",
  },
];

function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>What Our Users Say</h2>
          <p>
            Hear from graduates and employers using our blockchain verification
            system
          </p>
        </div>

        <div className="slider-container">
          <div
            className="testimonials-slider"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card ${
                  index === currentSlide ? "active sliding-in" : "sliding-out"
                }`}
              >
                <div className="testimonial-content">{testimonial.content}</div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="slider-arrows">
            <button className="arrow-btn prev" onClick={prevSlide}>
              <FaChevronLeft />
            </button>
            <button className="arrow-btn next" onClick={nextSlide}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="slider-controls">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
