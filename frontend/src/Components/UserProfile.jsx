import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Button, Alert, Card, Form, Nav, Navbar, Spinner, Modal
} from 'react-bootstrap';
import { fetchCompany } from "./api";

import avatarImage from "../Assets/userBlue.png";
import logoImage from "../Assets/Logo3.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundBottom from "../Assets/nobackground.png";

import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserProfile.css";

export function UserProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-signup"); 
  };  

  const handleClick = (path) => {
    const pathname = path === "home" ? "/" :
                     path === "opportunities" ? "/opportunities-page" :
                     path === "profile" ? "/user-profile" :
                     path === "companies" ? "/companies-page" : 
                     path === "deals" ? "/deals-page" : "/";
    navigate(pathname);
  };

  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    description: "",
    location: "",
    website: "",
    email: ""
  });
  const [creationSuccess, setCreationSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem("userId", data._id);
      } else {
        console.error("Error fetching user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCompany();
  }, []);

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not found");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name || "");
    formData.append("bio", user.bio || "");
    formData.append("location", user.location || "");
    formData.append("website", user.website || "");
    if (profilePicture) formData.append("profilePicture", profilePicture);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        const updated = await response.json();
        setUser(updated.updatedUser || updated); 
        setIsEditing(false);
        setProfilePicture(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMyCompanyClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/business/owned", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 403) {
          setShowCreateModal(true);
        } else {
          throw new Error("Error fetching user's business");
        }
      } else {
        const business = await response.json();
        navigate("/user-company-page", { state: { business } });
      }
    } catch (err) {
      console.error("Error checking user's company:", err.message);
    }
  };

  const createCompany = async () => {
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      const response = await fetch("http://localhost:3000/api/business/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCompany),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating company");
      }

      setCreationSuccess(true);
      setNewCompany({ description: "", location: "", website: "", email: "" });
      fetchCompany();
      setTimeout(() => {
        setCreationSuccess(false);
        setShowCreateModal(false);
      }, 2000);
    } catch (err) {
      alert(`Failed to create company: ${err.message}`);
    }
  };

  const handleSeeMyPosts = async () => {
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Backgrounds */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '200px', height: '300px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 500, right: -50, width: '500px', height: '310px', backgroundImage: `url(${backgroundBottom})`, backgroundSize: 'cover', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 400, left: 0, width: '150px', height: '400px', backgroundImage: `url(${backgroundIv})`, backgroundSize: 'cover', zIndex: 999 }} />

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
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Profile */}
      <Container className="d-flex flex-column justify-content-center align-items-center mt-5">
        {isLoading ? (
          <Spinner animation="border" />
        ) : (
          <Card style={{ width: '28rem' }} className="text-center shadow">
            <Card.Img
              variant="top"
              src={user.profileImage || avatarImage}
              className="rounded-circle mx-auto mt-4"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{user.name}</Card.Title>
              <Card.Text>{user.bio || "No bio provided"}</Card.Text>
              <Card.Text><strong>Location:</strong> {user.location || "Not specified"}</Card.Text>
              <Card.Text><strong>Website:</strong> {user.website || "No website"}</Card.Text>
              <div className="d-flex justify-content-center mt-4 gap-3 flex-wrap">
                <Button variant="outline-primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button variant="outline-primary" onClick={() => navigate('/company-post-page')}>Post a Deal</Button>
                <Button variant="outline-primary" onClick={() => navigate('/deals-page')}>Latest Deals</Button>
                <Button variant="outline-primary" onClick={handleMyCompanyClick}>View Company</Button>
                <Button variant="outline-primary" onClick={handleSeeMyPosts}>See My Posts</Button>
                <Button variant="outline-primary" onClick={() => navigate('/messages-grouped')}>Conversations</Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Edit Form */}
        {isEditing && (
          <Card className="mt-5 p-4 shadow-sm" style={{ width: '100%', maxWidth: '700px' }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={user.name || ""} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control name="bio" as="textarea" value={user.bio || ""} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control name="location" value={user.location || ""} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control name="website" value={user.website || ""} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload New Profile Picture (optional)</Form.Label>
                <Form.Control type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
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
    </>
  );
}

export default UserProfile;
