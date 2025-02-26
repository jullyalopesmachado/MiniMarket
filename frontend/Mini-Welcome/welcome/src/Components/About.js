import React from "react";
import AboutBackground from "../Assets/about-background.png";
import AboutBackgroundImage from "../Assets/about-background-image.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div id="about" className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="About Background" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="About" style={{ borderRadius: "30%" }} />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">About Us</p>
        <h1 className="primary-heading">Learn More About This Initiative</h1>
        <p className="primary-text">
          Our mission is to empower small businesses by creating a collaborative space where 
          entrepreneurs can network, exchange ideas, and build lasting partnerships.
        </p>
        <p className="primary-text">
          We’re here to help you grow your business through genuine connections and shared opportunities.
        </p>
        <div className="about-buttons-container">
          <button className="secondary-button">Learn More</button>
          <a
            href="https://www.youtube.com/watch?v=f8hT3oDDf6c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="watch-video-button">
              <BsFillPlayCircleFill /> Watch Video
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
