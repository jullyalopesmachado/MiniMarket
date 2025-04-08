import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container, Row, Col, Card, Navbar, Nav, Pagination, NavDropdown
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logoImage from "../Assets/Logo3.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundBottom from "../Assets/delivery-image-Photoroom.png";

export function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const navigate = useNavigate();

  useEffect(() => {
    const exampleDeals = [
      {
        id: 1,
        company: "TechNova",
        title: "50% Off All Services",
        description: "Get half off on all our web development packages until the end of the month!",
        expirationDate: "2025-04-30",
      },
      {
        id: 2,
        company: "EcoFresh Co.",
        title: "Free Delivery on Orders Over $25",
        description: "Enjoy free delivery on all eco-friendly grocery orders above $25.",
        expirationDate: "2025-05-10",
      },
      {
        id: 3,
        company: "BrightEdu",
        title: "2-Week Free Coding Bootcamp",
        description: "Sign up now and get a free trial of our online coding bootcamp. Offer valid for new students only.",
        expirationDate: "2025-04-20",
      },
    ];

    setDeals(exampleDeals);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = deals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(deals.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* Background Decorations - On Top */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '200px', height: '300px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 500, right: -50, width: '500px', height: '310px', backgroundImage: `url(${backgroundBottom})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />
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
                <Nav.Link onClick={() => navigate("/opportunities-page")}>See Opportunities</Nav.Link>
                <Nav.Link onClick={() => navigate("/deals-page")}>See Deals</Nav.Link>


              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-5">
          <h3 className="mb-4">Latest Deals from Companies</h3>
          <Row>
            {currentItems.map((deal) => (
              <Col md={6} key={deal.id} className="mb-4">
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <Card.Title>{deal.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">by {deal.company}</Card.Subtitle>
                    <Card.Text>{deal.description}</Card.Text>
                    <Card.Text>
                      <strong>Expires on:</strong> {new Date(deal.expirationDate).toLocaleDateString()}
                    </Card.Text>
                  </Card.Body>
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
      </div>
    </>
  );
}

export default DealsPage;