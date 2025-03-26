import React from "react";
import JoinUs from "../Assets/JoinUs.jpg";
import PickHowOften from "../Assets/choose-image.png";
import HelpCommunity from "../Assets/delivery-image.png";

const Work = () => {
  const workInfoData = [
    {
      image: JoinUs,
      title: "Become a Member",
      text: "Our wonderful community awaits you!",
    },
    {
      image: PickHowOften,
      title: "It's Up To You!",
      text: "Pick how many business you want to connect with and contribute to! ",
    },
    {
      image: HelpCommunity,
      title: "Help Your Community Grow",
      text: "Connect with thousands of small businesses",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Want to learn more about us?</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
          Sign up to learn about many deals available with other small business and become a part of this community!
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
