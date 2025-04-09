import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Nav,
  Navbar,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logoImage from "../Assets/Logo3.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundBottom from "../Assets/nobackground.png";
import backgroundIv from "../Assets/about-background.png";

export function UserCompany() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState(null);

  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    address: {
      city: "",
      state: "",
      country: "",
    },
    contact: {
      phone: "",
      email: "",
    },
    website: "",
  });

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
      fetchCompany(storedId);
    }
  }, []);

  const fetchCompany = async (uid) => {
    const token = localStorage.getItem("token");
    if (!token || !uid) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/business", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error fetching companies");

      const data = await response.json();
      const filtered = data.filter((company) => company.owner === uid);

      setCompanies(
        filtered.map((company) => ({
          id: company._id,
          owner: company.owner,
          companyPhoto: null,
          companyName: company.name,
          companyBio: company.description,
          companyLocation: `${company.address.city}, ${company.address.state}, ${company.address.country}`,
          companyWebsite: company.website || "N/A",
          isEditing: false,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to fetch companies");
    } finally {
      setIsLoading(false);
    }
  };

  const createCompany = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;

    const payload = {
      ...newCompany,
      owner: userId,
    };

    try {
      const response = await fetch("http://localhost:3000/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error creating company");

      fetchCompany(userId);
      setShowCreateModal(false);
      setShowSuccessMessage(true);
      setNewCompany({
        name: "",
        description: "",
        address: { city: "", state: "", country: "" },
        contact: { phone: "", email: "" },
        website: "",
      });

      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      alert(`Failed to create company: ${err.message}`);
    }
  };

  const handleEditToggle = (id) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, isEditing: !company.isEditing } : company
      )
    );
  };

  const handleSave = (id) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, isEditing: false } : company
      )
    );
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
                <Nav.Link onClick={() => navigate("/companies-page")}>Companies</Nav.Link>
                <Nav.Link onClick={() => navigate("/opportunities-page")}>See Opportunities</Nav.Link>
                <Nav.Link onClick={() => navigate("/deals-page")}>See Deals</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-5">
          {showSuccessMessage && (
            <Alert variant="success" className="text-center">
              Company successfully created!
            </Alert>
          )}

          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
              <Spinner animation="border" />
            </div>
          ) : companies.length > 0 ? (
            <Row>
              {companies.map((company) => (
                <Col md={4} key={company.id}>
                  <Card style={{ width: "19rem" }} className="mb-5 shadow-sm">
                    <Card.Body>
                      {company.isEditing ? (
                        <>
                          <Form.Group className="mb-2">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={company.companyName}
                              onChange={(e) =>
                                setCompanies((prev) =>
                                  prev.map((c) =>
                                    c.id === company.id ? { ...c, companyName: e.target.value } : c
                                  )
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Company Bio</Form.Label>
                            <Form.Control
                              as="textarea"
                              value={company.companyBio}
                              onChange={(e) =>
                                setCompanies((prev) =>
                                  prev.map((c) =>
                                    c.id === company.id ? { ...c, companyBio: e.target.value } : c
                                  )
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                              type="text"
                              value={company.companyLocation}
                              onChange={(e) =>
                                setCompanies((prev) =>
                                  prev.map((c) =>
                                    c.id === company.id ? { ...c, companyLocation: e.target.value } : c
                                  )
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Label>Website</Form.Label>
                            <Form.Control
                              type="text"
                              value={company.companyWebsite}
                              onChange={(e) =>
                                setCompanies((prev) =>
                                  prev.map((c) =>
                                    c.id === company.id ? { ...c, companyWebsite: e.target.value } : c
                                  )
                                )
                              }
                            />
                          </Form.Group>
                          <Button variant="primary" onClick={() => handleSave(company.id)}>
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Card.Title>{company.companyName}</Card.Title>
                          <Card.Text>{company.companyBio}</Card.Text>
                          <Card.Text>
                            <strong>Location:</strong> {company.companyLocation}
                          </Card.Text>
                          <Card.Text>
                            <strong>Website:</strong>{" "}
                            <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">
                              {company.companyWebsite}
                            </a>
                          </Card.Text>
                          <Button variant="primary">Message</Button>
                          <Button
                            variant="outline-primary"
                            className="ms-2"
                            onClick={() => handleEditToggle(company.id)}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center">
              <p>No company found. Want to create one?</p>
              <Button onClick={() => setShowCreateModal(true)}>Create Company</Button>
            </div>
          )}
        </Container>

        {/* Create Company Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Company</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={newCompany.description} onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>City</Form.Label>
                <Form.Control value={newCompany.address.city} onChange={(e) => setNewCompany({ ...newCompany, address: { ...newCompany.address, city: e.target.value } })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>State</Form.Label>
                <Form.Control value={newCompany.address.state} onChange={(e) => setNewCompany({ ...newCompany, address: { ...newCompany.address, state: e.target.value } })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Country</Form.Label>
                <Form.Control value={newCompany.address.country} onChange={(e) => setNewCompany({ ...newCompany, address: { ...newCompany.address, country: e.target.value } })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Phone</Form.Label>
                <Form.Control value={newCompany.contact.phone} onChange={(e) => setNewCompany({ ...newCompany, contact: { ...newCompany.contact, phone: e.target.value } })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control value={newCompany.contact.email} onChange={(e) => setNewCompany({ ...newCompany, contact: { ...newCompany.contact, email: e.target.value } })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Website</Form.Label>
                <Form.Control value={newCompany.website} onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={createCompany}>Create</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default UserCompany;
