import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Button, Card, Pagination, Navbar,
  NavDropdown, Nav, Form, Modal
} from 'react-bootstrap';
import { fetchData } from "./api";

import backgroundPeopleImage from '../Assets/nobackground.png';
import backgroundIv from '../Assets/about-background.png';
import logoImage from "../Assets/Logo3.png";
import backRightImage from "../Assets/home-banner-background.png";

function OppListPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
    posted_by: ""
  });
  const [businessName, setBusinessName] = useState("");
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const itemsPerPage = 2;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOpportunity((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchUserBusinessName = async () => {
      try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch user business name.");
      }

      const data = await response.json();
      setNewOpportunity((prev) => ({ ...prev, posted_by: data.businessName || "Unknown", }));
      localStorage.setItem("businessName", data.businessName || "Unknown");
      console.log("Business name set in local storage:", data.businessName || "Unknown");
  } catch (error) {
      console.error("Error fetching user business name:", err.message);
  }
    };

    fetchUserBusinessName();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const businessId = localStorage.getItem("businessId");
    const businessName = localStorage.getItem("businessName");
  
    if (!newOpportunity.title || !newOpportunity.description || !newOpportunity.type || !newOpportunity.location) {
      setError("All fields are required.");
      return;
    }
  
    if (!businessId || !businessName) {
      setError("Missing business ID or name. Please make sure your business is registered.");
      return;
    }
  
    const opportunityToSubmit = {
      ...newOpportunity,
      businessId,
      businessName,
      posted_by: businessName
    };
  
    try {
      const response = await fetch("http://localhost:3000/api/opportunities/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(opportunityToSubmit)
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to post opportunity.");
      }
  
      setShowSuccessModal(true);
      setNewOpportunity({ title: "", description: "", type: "", location: "", posted_by: "" });
      setError(null);
  
      setTimeout(() => {
        setShowModal(false);
        navigate("/opportunities-page");
        fetchOpportunities(); // fetch new data
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };
  
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/opportunities/view");
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const data = await response.json();
        console.log("Fetched opportunities:", data);
        setOpportunities(data.opportunities); // 👈 API returns an `opportunities` array
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOpportunities();
  }, []);
  

 // Update filtered opportunities whenever opportunities or filterType changes
useEffect(() => {
  const opps = filterType === "All"
    ? opportunities
    : opportunities.filter(opp => opp.type === filterType);

  setFilteredOpportunities(opps || []);
}, [opportunities, filterType]);

    
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredOpportunities)
  ? filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem)
  : [];
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* Background Decorations - On Top */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '200px', height: '300px', backgroundImage: `url(${backRightImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 500, right: 0, width: '250px', height: '300px', backgroundImage: `url(${backgroundPeopleImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 400, left: 0, width: '150px', height: '400px', backgroundImage: `url(${backgroundIv})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />

      <div className="min-vh-100 w-100 position-relative">
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
                <Nav.Link onClick={() => navigate("/opportunities-page")}>Opportunities</Nav.Link>
                <Nav.Link onClick={() => navigate("/deals-page")}> See Deals</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Row className="mb-4">
            <Col md={4}>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Opportunities</option>
                <option value="Job">Job</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            {loading ? 
            ( <p>Loading...</p>) :
            opportunities && opportunities.length > 0 ? (
            currentItems.map((opportunity) => (
              <Col key={opportunity._id} md={6} className="mb-4">
                <Card className="text-center shadow-sm">
                  <Card.Header>{opportunity.type.toUpperCase()}</Card.Header>
                  <Card.Body>
                    <Card.Title>{opportunity.title}</Card.Title>
                    <Card.Text>{opportunity.description}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedOpportunity(opportunity);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                  <Card.Footer className="text-muted">
                    Posted by {opportunity.posted_by} on {new Date(opportunity.createdAt).toLocaleDateString()}
                  </Card.Footer>
                </Card>
              </Col>
            ))) : (
              <p>No opportunities available at the moment.</p>
            )}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          )}
        </Container>
          {/* Post New Opportunity */}
        <Container className="mt-5">
                <Row className="justify-content-center">
                  <Col md={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title className="mb-4">Post a New Opportunity</Card.Title>
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label>Opportunity Title</Form.Label>
                            <Form.Control
                              type="text"
                              name="title"
                              value={newOpportunity.title}
                              onChange={handleChange}
                              placeholder="Enter Opportunity title"
                            />
                          </Form.Group>
        
                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="description"
                              value={newOpportunity.description}
                              onChange={handleChange}
                              placeholder="Describe your opportunity"
                            />
                          </Form.Group>
        
                          <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                              name="type"
                              value={newOpportunity.type}
                              onChange={handleChange}
                            >
    <option value="">Select a Category</option>
    <option value="Job">Job</option>
    <option value="Volunteer">Volunteer</option>
    <option value="Internship">Internship</option>
    <option value="Freelance">Freelance</option>
                          </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                              type="text"
                              name="location"
                              value={newOpportunity.location}
                              onChange={handleChange}
                            />
                          </Form.Group>
        
                          {error && <p className="text-danger">{error}</p>}
        
                          <Button type="submit" variant="primary">Post Opportunity</Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
        
              <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your Opportunity posted successfully!</Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={() => navigate("/opportunities-page")}>
                    OK
                  </Button>
                </Modal.Footer>
              </Modal>

        {/* Detail Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedOpportunity?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Type:</strong> {selectedOpportunity?.type}</p>
            <p><strong>Description:</strong> {selectedOpportunity?.description}</p>
            <p><strong>Posted By:</strong> {selectedOpportunity?.posted_by}</p>
            <p><strong>Date:</strong> {new Date(selectedOpportunity?.createdAt).toLocaleDateString()}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default OppListPage;