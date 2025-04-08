import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Button, Card, Pagination, Navbar,
  NavDropdown, Nav, Form, Modal
} from 'react-bootstrap';

import backgroundPeopleImage from '../Assets/nobackground.png';
import backgroundIv from '../Assets/about-background.png';
import logoImage from "../Assets/Logo3.png";
import backRightImage from "../Assets/home-banner-background.png";

function OppListPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 2;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const mockData = [
          {
            _id: "1",
            type: "Volunteer",
            title: "Park Clean-Up Volunteer Needed",
            description: "Join us this weekend to help clean up the city park and make it beautiful again!",
            posted_by: "GreenCity Org",
            createdAt: "2025-04-05T10:00:00Z",
          },
          {
            _id: "2",
            type: "Job",
            title: "Part-Time Cashier at Local Grocery",
            description: "We’re hiring a part-time cashier to join our friendly neighborhood store. Flexible hours!",
            posted_by: "FreshMart",
            createdAt: "2025-04-06T12:30:00Z",
          },
          {
            _id: "3",
            type: "Internship",
            title: "Social Media Intern at Café",
            description: "Help our local café grow its online presence! Great for marketing students.",
            posted_by: "BeanBuzz Café",
            createdAt: "2025-04-07T09:00:00Z",
          }
        ];

        setOpportunities(mockData);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredOpportunities = filterType === "All"
    ? opportunities
    : opportunities.filter(opp => opp.type === filterType);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
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
                <Nav.Link onClick={() => navigate("/profilePage")}>Profile</Nav.Link>
                <Nav.Link onClick={() => navigate("/userListPage")}>Users</Nav.Link>
                <Nav.Link onClick={() => navigate("/post-opportunity")}>Post Opportunity</Nav.Link>
                <NavDropdown title="Admin">
                  <NavDropdown.Item onClick={() => navigate('/adminPanelOp')}>Approve Opportunity</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/adminPanelUser')}>Approve User</NavDropdown.Item>
                </NavDropdown>
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
              </Form.Select>
            </Col>
          </Row>
          <Row>
            {currentItems.map((opportunity) => (
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
            ))}
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
