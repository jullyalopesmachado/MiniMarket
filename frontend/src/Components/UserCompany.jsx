import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Nav,
  Navbar,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logoImage from "../Assets/Logo3.png";
import avatarImage from "../Assets/compphoto1.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundBottom from "../Assets/nobackground.png";
import backgroundIv from "../Assets/about-background.png";

export function UserCompany() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const response = await fetch("http://localhost:3000/api/business/owned", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) throw new Error("Error fetching company");
  
        const userCompany = await response.json();
      
  
        if (userCompany) {
          setCompany(userCompany);
        }
      } catch (err) {
        console.error("Failed to fetch company:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
    
  }, []);

 

  return (
    <>
      {/* Background Decorations */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '200px', height: '300px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 500, right: -50, width: '500px', height: '310px', backgroundImage: `url(${backgroundBottom})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 400, left: 0, width: '150px', height: '400px', backgroundImage: `url(${backgroundIv})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />

      <div className="min-vh-100 w-100 position-relative">
        {/* Navbar */}
        <Navbar bg="light" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
              <img src={logoImage} alt="Logo" style={{ width: '80px' }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                <Nav.Link onClick={() => navigate("/companies-page")}>Companies</Nav.Link>
                <Nav.Link onClick={() => navigate("/opportunities-page")}>See Opportunities</Nav.Link>
                <Nav.Link onClick={() => navigate("/deals-page")}>See Deals</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Company Card */}
        <Container className="d-flex flex-column justify-content-center align-items-center mt-5">
          <Card style={{ width: '28rem' }} className="text-center shadow">
            <Card.Img
              variant="top"
              src={avatarImage}
              className="rounded-circle mx-auto mt-4"
              style={{ width: "40%", height: "auto" }}
            />
            <Card.Body>
              <Card.Title>
                {isLoading ? "Loading company..." : company?.name || "Company Name"}
              </Card.Title>
              <Card.Text>
                {isLoading ? "Fetching description..." : (company?.description || "No description provided")}
              </Card.Text>
              <Card.Text><strong>Location:</strong> {isLoading ? "..." : (company?.location || "Not specified")}</Card.Text>
              <Card.Text><strong>Email:</strong> {isLoading ? "..." : (company?.email || "Not provided")}</Card.Text>
              <Card.Text>
                <strong>Website:</strong>{" "}
                {isLoading ? "..." :
                  (company?.website ? (
                    <a href={company.website.startsWith('http') ? company.website : `http://${company.website}`} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  ) : "N/A")}
              </Card.Text>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default UserCompany;
