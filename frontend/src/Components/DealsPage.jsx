import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container, Row, Col, Card, Navbar, Nav, Pagination, Modal, Button
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logoImage from "../Assets/Logo3.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundBottom from "../Assets/delivery-image-Photoroom.png";

export function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 2;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/deals");
        if (!response.ok) {
          throw new Error("Failed to fetch deals");
        }
        const data = await response.json();
        setDeals(data);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = deals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(deals.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = (deal) => {
    setSelectedDeal(deal);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDeal(null);
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
                <Nav.Link onClick={() => navigate("/user-profile")}>Profile</Nav.Link>
                <Nav.Link onClick={() => navigate("/companies-page")}>Companies</Nav.Link>
                <Nav.Link onClick={() => navigate("/opportunities-page")}>See Opportunities</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Deals List */}
        <Container className="mt-5">
          <h3 className="mb-4">Latest Deals from Small Businesses</h3>
          <Row>
            {currentItems.map((deal) => (
              <Col md={6} key={deal._id} className="mb-4">
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <Card.Title>{deal.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">by {deal.businessName}</Card.Subtitle>
                    <Card.Text>
                      <strong>Expires:</strong> {new Date(deal.expirationDate).toLocaleDateString()}
                    </Card.Text>
                    <Button variant="outline-primary" onClick={() => handleShowModal(deal)}>
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
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

        {/* Modal for Deal Details */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedDeal?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Company:</strong> {selectedDeal?.businessName}</p>
            <p><strong>Description:</strong> {selectedDeal?.description}</p>
            <p><strong>Expires on:</strong> {new Date(selectedDeal?.expirationDate).toLocaleDateString()}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default DealsPage;
