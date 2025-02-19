import React from "react";
import logo from "../components/imgs/Logo3.png";
import shop1 from "../components/imgs/_Shop~.png";
import shop2 from "../components/imgs/Groceries.png";
import shop3 from "../components/imgs/OrganicGrocery1.png";
import shop4 from "../components/imgs/OrganicGrocery.png"; // Fixing shop4 import

import { SearchBar } from "./SearchBar";
import "./WelcomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export const WelcomePage = ({ setShowWelcome, setResults }) => {
  return (
    <div className="WelcomePage">
      <div className="top-dec-container">
        <div className="mid-dec-container"></div>
      </div>

      <div className="logo-top-container">
        <img src={logo} alt="Logo that says Mini Market" />
      </div>

      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
      </div>

      <div className="top-buttons">
        <button type="button">Home</button>
        <button type="button">Login</button>
        <button type="button">Contact</button>
        <button type="button">Help</button>
      </div>
      {/* asked chat to add comments - need to look more into carousel */}
      {/* Carousel Component - Does not auto-slide */}
      <div id="marketCarousel" className="carousel slide">  
        {/* Carousel Inner - Holds all slides */}
        <div className="carousel-inner">
          
          {/* First Slide - Active by default */}
          <div className="carousel-item active">
            <div className="carousel-grid">
              
              {/* First Image */}
              <div className="carousel-image">
                <img src={shop1} className="d-block w-100" alt="Market 1" />
                <div className="carousel-caption">
                  <h5>Market 1</h5>
                  <p>Fresh produce and groceries.</p>
                </div>
              </div>

              {/* Second Image */}
              <div className="carousel-image">
                <img src={shop2} className="d-block w-100" alt="Market 2" />
                <div className="carousel-caption">
                  <h5>Market 2</h5>
                  <p>Organic food and local items.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Slide */}
          <div className="carousel-item">
            <div className="carousel-grid">
              
              {/* Third Image */}
              <div className="carousel-image">
                <img src={shop3} className="d-block w-100" alt="Market 3" />
                <div className="carousel-caption">
                  <h5></h5>
                  <p></p>
                </div>
              </div>

              {/* Fourth Image */}
              <div className="carousel-image">
                <img src={shop4} className="d-block w-100" alt="Market 4" />
                <div className="carousel-caption">
                  <h5></h5>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Button */}
        <button 
          className="carousel-control-prev" 
          type="button" 
          data-bs-target="#marketCarousel" 
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        {/* Next Button */}
        <button 
          className="carousel-control-next" 
          type="button" 
          data-bs-target="#marketCarousel" 
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};
