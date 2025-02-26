import React from "react";
import ProfilePic from "../Assets/john-doe-image.png";
import { AiFillStar } from "react-icons/ai";

const Testimonial = () => {
  return (
    <div id="feedback" className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Feedback</p>
        <h1 className="primary-heading">What our members say:</h1>
        <p className="primary-text">We value your feedback!</p>
      </div>    
      <div className="testimonial-section-bottom">
        <img
          src={ProfilePic}
          alt="Profile"
          style={{ width: "120px", height: "120px", borderRadius: "50%" }}
        />
        <p>
          I love being a part of MiniMarket! Can't find a better web app!
        </p>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <h2>Eddie Vedder</h2>
      </div>
    </div>
  );
};

export default Testimonial;
