import React from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/sections/Hero';
import Statistics from '../components/sections/Statistics';
import HowItWorks from '../components/sections/HowItWorks';
import SeeTheDifference from '../components/sections/SeeTheDifference';
import Footer from '../components/layout/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-blue">
      <Header />
      <main>
        <Hero />
        <Statistics />
        <HowItWorks />
        <SeeTheDifference />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

