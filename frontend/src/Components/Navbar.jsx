/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
import { Button } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import { SearchBar } from "./SearchBar";
import { SearchResultList } from "./SearchResultList";


const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showLoginSignup, setShowLoginSignup] = useState(false); // New state
  const navigate = useNavigate(); // Initialize navigate function
  const [userStatus, setUserStatus] = useState("User not logged in");
  const [results, setResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");

  const handleSelect = (value) => {
    setQuery(value);
    setSearchActive(false);
    setResults([]);
    // Optional: navigate to a profile or result page
    // navigate(`/user/${value}`);
  };
  
  
  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
      href: "#home",
    },
    {
      text: "About us",
      icon: <InfoIcon />,
      href: "#about",
    },
    {
      text: "Feedback",
      icon: <CommentRoundedIcon />,
      href: "#feedback",
    },
    {
      text: "Contact us",
      icon: <PhoneRoundedIcon />,
      href: "#contact",
    },

  ];

  
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
    <nav>
    <div className="nav-logo-container">
      
    <img src={Logo} alt="Logo" style={{ width: "100px", height: "auto" }} />
  </div>

<div
  className="navbar-links-container"
  style={{
    marginLeft: "12%" // or 60px, 80px depending how far right you want it
  }}
>

    {menuOptions.map((item) => (
      <a 
        key={item.text} 
        href={item.href || "#"} 
        onClick={item.action || null}
      >
        {item.text}
      </a>
    ))}

    {userStatus === "User logged in" && (
      <Button
        variant="primary"
        className="secondary-button"
        onClick={() => navigate("/opportunities-page")}
        style={{
          backgroundColor: "white",
          color: "#0d6efd",
          borderRadius: "25px",
          border: "1px solid #0d6efd",
          padding: "8px 16px",
          fontWeight: "bold"
        }}
      >
        Services <FiArrowRight />
      </Button>
    )}
  </div>

  <div className="navbar-menu-container">
    <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
  </div>

{/* Search Bar placed nicely inside the navbar */}
<div className="search-container">
  <SearchBar
    query={query}
    setQuery={setQuery}
    setResults={setResults}
    setSearchActive={setSearchActive}
  />
  {searchActive && results.length > 0 && (
    <SearchResultList results={results} onSelect={handleSelect} />
  )}
  {searchActive && results.length === 0 && (
    <p className="no-results">No users found.</p>
  )}
</div>


  <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpenMenu(false)}>
      <List>
        {menuOptions.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component="a" href={item.href || "#"} onClick={item.action || null}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  </Drawer>
</nav>

  );
};

export default Navbar;