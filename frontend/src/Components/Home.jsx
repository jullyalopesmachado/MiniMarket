import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/login-signup");
  };

  return (
    <div id="home" className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="Banner Background" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Your Favorite Small Businesses Are Here!
          </h1>
          <p className="primary-text">
            Connect to your community and help it grow.
          </p>
          <button className="secondary-button" onClick={handleSignupClick}>
            Sign Up Now <FiArrowRight />
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="Banner" style={{ borderRadius: "70%" }} />
        </div>
      </div>
    </div>
  );
};

export default Home;
