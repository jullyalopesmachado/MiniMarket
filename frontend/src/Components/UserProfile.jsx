import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Button, Alert, Card, Form, Nav, Navbar, NavDropdown, Spinner
} from 'react-bootstrap';

import avatarImage from "../Assets/userBlue.png";
import logoImage from "../Assets/Logo3.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundBottom from "../Assets/delivery-image-Photoroom.png";

import { updateData } from "../App";

export function UserProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Layne");
  const [lastName, setLastName] = useState("Staley");
  const [userBio, setUserBio] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userWebsite, setUserWebsite] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const profile = await response.json();
        const [first, last] = (profile.name || "").split(" ");
        setFirstName(first || "");
        setLastName(last || "");
        setUserId(profile._id);
        setUserBio(profile.bio || "");
        setUserLocation(profile.location || "");
        setUserWebsite(profile.website || "");
      } else {
        console.error("Error fetching user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!firstName || !lastName) {
      setError("Required information missing");
      return;
    }

    setIsLoading(true);
    setError(null);

    const updatedProfile = {
      _id: userId,
      name: firstName + " " + lastName,
      bio: userBio,
      location: userLocation,
      website: userWebsite,
    };

    try {
      await updateData(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-signup");
  };

  return (
    <>
      {/* Background Images */}
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
                <Nav.Link onClick={() => navigate("/user-profile")}>Profile</Nav.Link>
                <Nav.Link onClick={() => navigate("/companies-page")}>Companies</Nav.Link>
                <Nav.Link onClick={() => navigate("/opportunities-page")}>See Opportunities</Nav.Link>
                <Nav.Link onClick={() => navigate("/deals-page")}>See Deals</Nav.Link>
                <NavDropdown title="Admin">
                  <NavDropdown.Item onClick={() => navigate('/adminPanelOp')}>Approve Opportunity</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/adminPanelUser')}>Approve User</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Profile Section */}
        <Container className="d-flex flex-column justify-content-center align-items-center mt-5">
          {isLoading ? (
            <Spinner animation="border" />
          ) : (
            <Card style={{ width: '28rem' }} className="text-center shadow">
              <Card.Img
                variant="top"
                src={avatarImage}
                className="rounded-circle mx-auto mt-4"
                style={{ width: "40%", height: "auto" }}
              />
              <Card.Body>
                <Card.Title>{firstName} {lastName}</Card.Title>
                <Card.Text>{userBio || "No bio provided"}</Card.Text>
                <Card.Text><strong>Location:</strong> {userLocation || "Not specified"}</Card.Text>
                <Card.Text><strong>Website:</strong> {userWebsite || "No website"}</Card.Text>
                <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </Card.Body>
            </Card>
          )}

          <div className="mt-4">
            <Button variant="primary" onClick={() => navigate('/company-post-page')} className="me-3">
              Post a Deal
            </Button>
            <Button variant="primary" onClick={() => navigate('/deals-page')}>
              Latest Deals
            </Button>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <Card className="mt-5 p-4 shadow-sm" style={{ width: '100%', maxWidth: '700px' }}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control as="textarea" value={userBio} onChange={(e) => setUserBio(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control type="text" value={userLocation} onChange={(e) => setUserLocation(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control type="text" value={userWebsite} onChange={(e) => setUserWebsite(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
              </Form>
            </Card>
          )}
        </Container>
      </div>
    </>
  );
}

export default UserProfile;
