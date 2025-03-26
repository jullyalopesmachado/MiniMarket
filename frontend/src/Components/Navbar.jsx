/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../Assets/Logo3.png";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import LoginSignup from "./LoginSignup";  // Ensure this path is correct

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showLoginSignup, setShowLoginSignup] = useState(false); // New state

  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
      href: "#home",
    },
    {
      text: "About",
      icon: <InfoIcon />,
      href: "#about",
    },
    {
      text: "Feedback",
      icon: <CommentRoundedIcon />,
      action: () => setShowLoginSignup(true), // Open LoginSignup modal
    },
    {
      text: "Contact",
      icon: <PhoneRoundedIcon />,
      href: "#contact",
    },
    {
      text: "Cart",
      icon: <ShoppingCartRoundedIcon />,
      href: "", 
    },
  ];

  return (
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="Logo" style={{ width: "100px", height: "auto" }} />
      </div>
      <div className="navbar-links-container">
        {menuOptions.map((item) => (
          <a 
            key={item.text} 
            href={item.href || "#"} 
            onClick={item.action || null} // Handle action instead of href
          >
            {item.text}
          </a>
        ))}
        <a href="#">
          <BsCart2 className="navbar-cart-icon" />
        </a>
        <button className="primary-button">Join Our Community</button>
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component="a" 
                  href={item.href || "#"} 
                  onClick={item.action || null} 
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Show LoginSignup when Feedback is clicked */}
      {showLoginSignup && (
        <div className="login-modal">
          <LoginSignup />
          <button onClick={() => setShowLoginSignup(false)}>Close</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
