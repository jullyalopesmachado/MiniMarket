import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container, Row, Col, Card, Navbar, Nav
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logoImage from "../Assets/Logo3.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundBottom from "../Assets/bottom-background.png";

export function DealsPage() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Example fallback deals
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

    // Optional: Fetch real deals from backend
    // const fetchDeals = async () => {
    //   try {
    //     const response = await fetch("http://localhost:3000/api/deals");
    //     const data = await response.json();
    //     setDeals(data);
    //   } catch (error) {
    //     console.error("Error fetching deals:", error);
    //     setDeals(exampleDeals); // fallback
    //   }
    // };

    setDeals(exampleDeals);
    // fetchDeals();
  }, []);

  return (
    <div className="min-vh-100 w-100">
      <Navbar expand="lg" className="img-fluid">
        <Container className="mt-4">
          <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: '10%' }} />
          <Navbar.Toggle aria-controls="basic-navbar" className="me-auto" />
          <Navbar.Collapse id="basic-navbar-nav" className="me-auto img-fluid">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate("/user-profile")}>Back to Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h3 className="mb-4">Latest Deals from Companies</h3>
        <Row>
          {deals.map((deal) => (
            <Col md={4} key={deal.id} className="mb-4">
              <Card>
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
      </Container>

      <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '350px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', top: 500, right: 0, width: '350px', height: '300px', backgroundImage: `url(${backgroundBottom})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', top: 10, right: 1350, width: '250px', height: '750px', backgroundImage: `url(${backgroundIv})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
    </div>
  );
}

export default DealsPage;
