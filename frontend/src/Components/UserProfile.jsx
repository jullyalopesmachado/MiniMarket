import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Button, Alert, Card, Form, Nav, Navbar, Spinner, Modal
} from 'react-bootstrap';

import avatarImage from "../Assets/userBlue.png";
import logoImage from "../Assets/Logo3.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundBottom from "../Assets/nobackground.png";

import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserProfile.css";
import { updateData } from "./api";

export function UserProfile() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-signup"); 
  };  
  const handleClick = (path) => {
    const pathname = path === "home" ? "/" :
                    path === "opportunities" ? "/opportunities-page" 
                    : path === "profile" ? "/user-profile" :
                    path === "companies" ? "/companies-page" : 
                    path === "deals" ? "/deals-page" : "/";

    if (!pathname) {
      console.error("Invalid path:", pathname);
      return;
    }
    navigate(pathname); 
  };

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Layne");
  const [lastName, setLastName] = useState("Staley");
  const [userBio, setUserBio] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userWebsite, setUserWebsite] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userMessages, setUserMessages] = useState({ sent: [], received: [] });
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);



  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    description: "",
    location: "",
    website: ""
  });
  const [creationSuccess, setCreationSuccess] = useState(false);

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
        localStorage.setItem("userId", profile._id);
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

  const handleMyCompanyClick = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/business/owned", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No business found, show the create modal
          setShowCreateModal(true);
        } else {
          throw new Error("Error fetching user's business");
        }
      } else {
        const business = await response.json();
        // Navigate to the user's company page with the business data
        navigate("/user-company-page", { state: { business } });
      }
    } catch (err) {
      console.error("Error checking user's company:", err.message);
    }
  };

  const createCompany = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;

    const payload = {
      ...newCompany,
    };

    try {
      const response = await fetch("http://localhost:3000/api/business/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating company");
      }

      setCreationSuccess(true);
      setNewCompany({ name: "", location: "", email: "", website: "", description: "" });

      setTimeout(() => {
        setCreationSuccess(false);
        setShowCreateModal(false);
      }, 2000);
    } catch (err) {
      alert(`Failed to create company: ${err.message}`);
    }
  };
    const handleSeeMyPosts = async () => {
      const token = localStorage.getItem("token");
      console.log("Token in use:", token);

      try {
        const response = await fetch("http://localhost:3000/api/business/owned", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to get company");
    
        const company = await response.json();
        if (company && company._id) {
          navigate(`/company-posts/${company._id}`);
        } else {
          alert("You don't own a company yet.");
        }
      } catch (err) {
        console.error("Error navigating to posts:", err.message);
      }
    };
    useEffect(() => {
      fetchProfile();
      fetchMessages();
    }, []);
    
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");
      if (!token || !currentUserId) return;
    
      try {
        const res = await fetch(`http://localhost:3000/api/messages/user/${currentUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        const data = await res.json();
    
        //  use sentMessages and receivedMessages from backend response
        if (!data.sentMessages || !data.receivedMessages) {
          console.error("Expected sentMessages and receivedMessages, got:", data);
          return;
        }
    
        setUserMessages({
          sent: data.sentMessages,
          received: data.receivedMessages
        });
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
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
                <Nav.Link onClick={() => handleClick("home")}>Home</Nav.Link>
                <Nav.Link onClick={() => handleClick("companies")}>Companies</Nav.Link>
                <Nav.Link onClick={() => handleClick("opportunities")}>See Opportunities</Nav.Link>
                <Nav.Link onClick={() => handleClick("deals")}>See Deals</Nav.Link>
                <Nav.Link onClick={handleMyCompanyClick}>My Company</Nav.Link>
              </Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
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
                <div className="d-flex justify-content-center mt-4 gap-3 flex-wrap">
                  <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="outline-primary" onClick={() => navigate('/company-post-page')}>
                    Post a Deal
                  </Button>
                  <Button variant="outline-primary" onClick={() => navigate('/deals-page')}>
                    Latest Deals
                  </Button>
                  <Button variant="primary" onClick={() => navigate('/user-company-page')}>
                    View Company 
                  </Button>
                  <Button variant="outline-secondary" onClick={handleSeeMyPosts}>
                    See My Posts
                  </Button>
                </div>

            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <Card.Title>Messages You Sent</Card.Title>
                {userMessages.sent.length === 0 ? (
                  <Card.Text>No messages sent.</Card.Text>
                ) : (
                  userMessages.sent.map((msg, idx) => (
                    <div key={idx}>
                      <strong>To:</strong> {msg.receiverName || msg.receiverId} — {msg.message}
                    </div>
                  ))
                )}

                <Card.Title className="mt-4">Messages You Received</Card.Title>
                {userMessages.received.length === 0 ? (
                  <Card.Text>No received messages.</Card.Text>
                ) : (
                  userMessages.received.map((msg, idx) => (
                    <div key={idx}>
                      <strong>From:</strong> {msg.senderName ||  msg.senderId} — {msg.message}
                    </div>
                  ))
                )}

              </Card.Body>
            </Card>


              </Card.Body>
            </Card>
          )}

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

        {/* Create Company Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Company</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {creationSuccess && <Alert variant="success">Company created successfully!</Alert>}
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Location</Form.Label>
                <Form.Control value={newCompany.location} onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={newCompany.email} onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Website</Form.Label>
                <Form.Control value={newCompany.website} onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={newCompany.description} onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={createCompany}>Create Company</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default UserProfile;
