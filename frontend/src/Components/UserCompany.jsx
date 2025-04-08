import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Card,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Modal,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import logoImage from "../Assets/Logo3.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundBottom from "../Assets/bottom-background.png";
import backgroundIv from "../Assets/about-background.png";

export function UserCompany() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [userStatus, setUserStatus] = useState("User logged in");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  const fetchCompany = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;

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
      const filtered = data.filter((company) => company.owner === userId);

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
      console.log("Create company result:", result);

      if (!response.ok) {
        console.error("Error creating company:", result);
        throw new Error(result.message || "Failed to create company");
      }

      fetchCompany();
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
      console.error("Error saving business:", err);
      alert(`Failed to create company: ${err.message}`);
    }
  };

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
      fetchCompany();
    }
  }, [userId]);

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

  const userCompanies = companies.filter((c) => c.owner === userId);

  return (
    <div className="min-vh-100 w-100">
      {showSuccessMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <div className="alert alert-success">
            Company successfully created and saved!
          </div>
        </div>
      )}

      <Navbar expand="lg" className="img-fluid">
        <Container className="mt-4">
          <Card.Img src={logoImage} className="me-auto img-fluid" style={{ width: "10%" }} />
          <Navbar.Toggle aria-controls="basic-navbar" className="me-auto" />
          <Navbar.Collapse id="basic-navbar-nav" className="me-auto img-fluid">
            <Nav className="ms-auto">
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          {userCompanies.length > 0 ? (
            userCompanies.map((company) => (
              <Col md={4} key={company.id}>
                <Card style={{ width: "19rem" }} className="mb-5">
                  {company.companyPhoto && (
                    <Card.Img variant="top" src={company.companyPhoto} />
                  )}
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
                                  c.id === company.id
                                    ? { ...c, companyName: e.target.value }
                                    : c
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
                                  c.id === company.id
                                    ? { ...c, companyBio: e.target.value }
                                    : c
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
                                  c.id === company.id
                                    ? { ...c, companyLocation: e.target.value }
                                    : c
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
                                  c.id === company.id
                                    ? { ...c, companyWebsite: e.target.value }
                                    : c
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
                        <Card.Text><strong>Location:</strong> {company.companyLocation}</Card.Text>
                        <Card.Text><strong>Website:</strong>{" "}
                          <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">
                            {company.companyWebsite}
                          </a>
                        </Card.Text>
                        <Button variant="primary">Message</Button>
                        <Button variant="outline-primary" className="ms-2" onClick={() => handleEditToggle(company.id)}>
                          Edit
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No company found. Want to create one?</p>
              <Button onClick={() => setShowCreateModal(true)}>Create Company</Button>
            </Col>
          )}
        </Row>
      </Container>

      <Dropdown style={{ position: "absolute", top: "100px", right: "150px" }}>
        <Dropdown.Toggle variant="primary">{userStatus}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setUserStatus("User logged in")}>User logged in</Dropdown.Item>
          <Dropdown.Item onClick={() => setUserStatus("Admin logged in")}>Admin logged in</Dropdown.Item>
          <Dropdown.Item onClick={() => setUserStatus("User not logged in")}>User not logged in</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

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

      <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "350px", backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }} />
      <div style={{ position: "absolute", top: 500, right: 0, width: "350px", height: "300px", backgroundImage: `url(${backgroundBottom})`, backgroundSize: "cover" }} />
      <div style={{ position: "absolute", top: 10, right: 1350, width: "250px", height: "750px", backgroundImage: `url(${backgroundIv})`, backgroundSize: "cover" }} />
    </div>
  );
}

export default UserCompany;
