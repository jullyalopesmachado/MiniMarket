import React from "react";

const Contact = () => {
  return (
    <div id="contact" className="contact-page-wrapper">
      <h1 className="primary-heading">Questions?</h1>
      <h1 className="primary-heading">Contact Us!</h1>
      <div className="contact-form-container">
        <input type="text" placeholder="Enter your email:" />
        <button className="secondary-button">Submit</button>
      </div>
    </div>
  );
};

export default Contact;
