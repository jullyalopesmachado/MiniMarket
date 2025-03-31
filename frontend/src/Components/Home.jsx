import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import Navbar from "./Navbar";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";

const Home = () => {
  const [userStatus, setUserStatus] = useState("User not logged in");
  const navigate = useNavigate();

  const handleSignupClick = () => {
    if (userStatus === "User not logged in") {
      navigate("/login-signup");
    }
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

          {userStatus === "User logged in" && (
          <button className="secondary-button" onClick={() => navigate("/opportunities-page")}   style={{
            variant: "primary",
            position: "absolute",
            top: "100px",
            right: "150px",
          }}>
            Services <FiArrowRight />
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
  }}
>
  <Dropdown.Toggle variant="primary">{userStatus}</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item onClick={() => setUserStatus("User logged in")}>
      User logged in
    </Dropdown.Item>
    <Dropdown.Item onClick={() => setUserStatus("Admin logged in")}>
      Admin logged in
    </Dropdown.Item>
    <Dropdown.Item onClick={() => setUserStatus("User not logged in")}>
      Logged out
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

    </div>
  );
};

export default Home;
