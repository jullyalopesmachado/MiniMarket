import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import Navbar from "./Navbar";
import BannerBackground from "../Assets/home-banner-background.png";
import { Container, Row, Col, Button, Card, Pagination, NavDropdown } from 'react-bootstrap';
import BannerImage from "../Assets/home-banner-image.png";


const Home = () => {
  const [userStatus, setUserStatus] = useState("User not logged in");
  const navigate = useNavigate();

  const handleSignupClick = () => {
    if (userStatus === "User not logged in") {
      navigate("/login-signup");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > now) {
          setUserStatus("User logged in");
        } else {
          localStorage.removeItem("token");
          setUserStatus("User not logged in");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setUserStatus("User not logged in");
      }
    }
  }, []);
  

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

          {userStatus === "User not logged in" && (
          <button className="secondary-button" onClick={handleSignupClick}>
            Sign Up or Log in Today <FiArrowRight />
          </button>
          )}
          {userStatus === "User logged in" && (
          <button className="secondary-button" onClick={() => navigate("/user-profile")}>
            User Profile <FiArrowRight />
          </button>
          )}

      {userStatus === "Admin logged in" && (
          <button className="secondary-button" onClick={() => navigate("/user-profile")}>
            User Profile <FiArrowRight />
          </button>
          )}

        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="Banner" style={{ borderRadius: "70%" }} />
        </div>
      </div>

      

      {/* User Status Dropdown */}
      <Dropdown
  style={{
    position: "absolute",
    top: "600px",
    right: "10px",
  }}></Dropdown>
    </div>
  );
};

export default Home;
