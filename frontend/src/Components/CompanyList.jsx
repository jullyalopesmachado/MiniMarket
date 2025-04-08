// Importing React and useState hook for managing component state
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container, Row, Col, Button, Dropdown, Alert, Breadcrumb,
  Card, Form, Nav, Navbar, NavDropdown, Modal
} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import logoImage from "../Assets/Logo3.png"; 
import companyPhoto from "../Assets/compphoto1.png";
import backgroundImage from "../Assets/home-banner-background.png"; 
import backgroundIv from "../Assets/about-background.png"; 
import backgroundBottom from "../Assets/bottom-background.png"; 

export function CompanyList({ user }) {
  const [userStatus, setUserStatus] = useState("User not logged in");
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [messagem, setMessage] = useState("");

  const fetchCompany = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/business", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const companyData = await response.json();
      console.log("Fetched Companies:", companyData);

      setCompanies(companyData.map(company => ({
        id: company._id,
        companyPhoto: null,
        companyName: company.name,
        companyBio: company.description,
        companyLocation: company.location,
        companyWebsite: company.website || "N/A",
        companyEmail: company.email || "",
        isEditing: false,
      })));
    } catch (error) {
      console.error("Error fetching companies:", error.message);
      setError("Failed to load company data.");
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleEditToggle = (id) => {
    if (user?.isAdmin || userStatus === "Admin logged in") {
      setCompanies(companies.map(company =>
        company.id === id ? { ...company, isEditing: !company.isEditing } : company
      ));
    } else {
      alert("Only admins can edit company details.");
    }
  };

  const handleSave = async (id) => {
    const companyToUpdate = companies.find(company => company.id === id);
    const token = localStorage.getItem("token");

    // Validate required fields
    if (!companyToUpdate.companyName || !companyToUpdate.companyBio || !companyToUpdate.companyLocation) {
      alert("Company name, bio, and location are required.");
      return;
    }

    const payload = {
      name: companyToUpdate.companyName,
      description: companyToUpdate.companyBio,
      website: companyToUpdate.companyWebsite,
      location: companyToUpdate.companyLocation,
      email: companyToUpdate.companyEmail || "example@example.com"
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`http://localhost:3000/api/business/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save changes");

      setCompanies(companies.map(company =>
        company.id === id ? { ...company, isEditing: false } : company
      ));
      alert("Company updated successfully!");
    } catch (error) {
      console.error("Error saving company:", error);
      alert("Error saving company changes.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-signup");
  };

  const handleMessageClick = (company) => {
    if (user) {
      alert("You're about to send a message.");
    } else {
      setSelectedCompany(company);
      setShowMessageModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (!messagem.trim()) {
      alert("Please enter a message.");
      return;
    }

    try {
      const response = await fetch(`/api/companies/${selectedCompany.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: messagem }),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        handleCloseModal();
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-vh-100 w-100">
      <Navbar expand="lg" className="img-fluid">
        <Container className="mt-4">
          <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: '10%' }} />
          <Navbar.Toggle aria-controls="basic-navbar" className="me-auto" />
          <Navbar.Collapse id="basic-navbar-nav" className="me-auto img-fluid">
            <Nav className="ms-auto">
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          {companies.map(company => (
            <Col md={4} key={company.id}>
              <Card style={{ width: "19rem" }} className="mb-5">
                <Card.Img variant="top" src={companyPhoto} />
                <Card.Body>
                  {company.isEditing ? (
                    <>
                      <Form.Group className="mb-2">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={company.companyName}
                          onChange={(e) => setCompanies(companies.map(c =>
                            c.id === company.id ? { ...c, companyName: e.target.value } : c
                          ))}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Company Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          value={company.companyBio}
                          onChange={(e) => setCompanies(companies.map(c =>
                            c.id === company.id ? { ...c, companyBio: e.target.value } : c
                          ))}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Company Location</Form.Label>
                        <Form.Control
                          type="text"
                          value={company.companyLocation}
                          onChange={(e) => setCompanies(companies.map(c =>
                            c.id === company.id ? { ...c, companyLocation: e.target.value } : c
                          ))}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Company Website</Form.Label>
                        <Form.Control
                          type="text"
                          value={company.companyWebsite}
                          onChange={(e) => setCompanies(companies.map(c =>
                            c.id === company.id ? { ...c, companyWebsite: e.target.value } : c
                          ))}
                        />
                      </Form.Group>

                      <Button variant="primary" onClick={() => handleSave(company.id)}>Save</Button>
                    </>
                  ) : (
                    <>
                      <Card.Title>{company.companyName}</Card.Title>
                      <Card.Text>{company.companyBio}</Card.Text>
                      <Card.Text><strong>Location:</strong> {company.companyLocation}</Card.Text>
                      <Card.Text><strong>Website:</strong> <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">{company.companyWebsite}</a></Card.Text>

                      {(user || userStatus !== "User not logged in") && (
                        <Button variant="primary" onClick={() => handleMessageClick(company)}>Message</Button>
                      )}

                      {(user?.isAdmin || userStatus === "Admin logged in") && (
                        <Button variant="outline-primary" className="ms-2" onClick={() => handleEditToggle(company.id)}>
                          Edit
                        </Button>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showMessageModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message to {selectedCompany?.companyName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={messagem}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSendMessage}>Send Message</Button>
        </Modal.Footer>
      </Modal>

      <Dropdown style={{ position: "absolute", top: "100px", right: "150px" }}>
        <Dropdown.Toggle variant="primary">{userStatus}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setUserStatus("User logged in")}>User logged in</Dropdown.Item>
          <Dropdown.Item onClick={() => setUserStatus("Admin logged in")}>Admin logged in</Dropdown.Item>
          <Dropdown.Item onClick={() => setUserStatus("User not logged in")}>User not logged in</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '350px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', top: 500, right: 0, width: '350px', height: '300px', backgroundImage: `url(${backgroundBottom})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', top: 10, right: 1350, width: '250px', height: '750px', backgroundImage: `url(${backgroundIv})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
    </div>
  );
}

export default CompanyList;
