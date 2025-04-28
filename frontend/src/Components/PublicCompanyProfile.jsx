import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Nav,
  Navbar,
  Form, // 
} from "react-bootstrap";

import logoImage from "../Assets/Logo3.png";
import companyPhoto from "../Assets/compphoto1.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundBottom from "../Assets/nobackground.png";
import backgroundIv from "../Assets/about-background.png";

function PublicCompanyProfile() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem("token");
  const [messagem, setMessagem] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/business/${companyId}`);
        if (!response.ok) throw new Error("Company not found");
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error loading company profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  const handleSendMessage = async () => {
    console.log("Sending message...");
    const token = localStorage.getItem("token");
    const senderId = localStorage.getItem("businessId");

    if (!messagem.trim() || !senderId) {
      alert("Message or sender is missing.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/messages/${companyId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId,
          receiverId: companyId,
          message: messagem,
          companyId,
        }),
      });

      console.log("Response status:", res.status);

      if (res.ok) {
        alert("Message sent successfully!");
        setMessagem(""); // Clear input
      } else {
        const errorData = await res.json();
        console.error("Failed to send message:", errorData);
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message.");
    }
  };

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

        {/* Company Profile Card */}
        <Container className="d-flex flex-column justify-content-center align-items-center mt-5">
          <Card style={{ width: '28rem' }} className="text-center shadow">
            <Card.Img
              variant="top"
              src={companyPhoto}
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

              {isLoggedIn && (
                <Form.Group className="mt-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={messagem}
                    onChange={(e) => setMessagem(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <Button className="mt-2" onClick={handleSendMessage}>Send Message</Button>
                </Form.Group>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default PublicCompanyProfile;
