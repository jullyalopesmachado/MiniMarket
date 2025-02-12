import React from "react";
import logo from "../components/imgs/Logo3.png"; 
import { SearchBar } from "./SearchBar";  // Import SearchBar
import "./WelcomePage.css"; 

export const WelcomePage = ({ setShowWelcome, setResults }) => {
  return (
    <div className="WelcomePage">
      <div className="top-dec-container"> 
        <div className="mid-dec-container"></div>
      </div>

      <div className="logo-top-container">
        <img src={logo} alt="Logo that says Mini Market" />
      </div>

      {/* Search bar should always be visible */}
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
      </div>

      <div className="top-buttons">
        <button type="button">Home</button>
        <button type="button">Login</button>
        <button type="button">Contact</button>
        <button type="button">Help</button>
      </div>

      {/* Continue button */}
      <button className="continue-btn" onClick={() => setShowWelcome(false)}>
        Continue
      </button>
    </div>
  );
};
