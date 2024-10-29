import React from 'react';
import jjm from "../assets/jjmlogo.jpg"; // Import the logo image

const Footer = () => {
  return (
    <footer className="bg-gray-400 text-white py-4 text-center">
      <img 
        src={jjm} 
        alt="JJM Soap and Detergents Manufacturing Logo" 
        className="h-10 mx-auto mb-2 rounded-xl" // Adjust height and margins as needed
      />
      <p>JJM Soap and Detergents Manufacturing © 2024</p>
    </footer>
  );
};

export default Footer;
