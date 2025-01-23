import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DegreeDetails from './components/DegreeDetails';
import 'font-awesome/css/font-awesome.min.css';

function App() {
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
      </div>
    </Router>
  );
}

export default App;
