import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container, Row, Col, Form, Button, Card, Modal, Navbar, Nav
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logoImage from "../Assets/Logo3.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundBottom from "../Assets/bottom-background.png";

export function PostDealPage() {
  const [deal, setDeal] = useState({
    title: "",
    description: "",
    expirationDate: ""
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!deal.title || !deal.description || !deal.expirationDate) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(deal)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to post deal.");
      }

      setShowSuccessModal(true);
      setDeal({ title: "", description: "", expirationDate: "" });

      // Redirect to the deals page after success
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/deals-page");
      }, 2000);
    } catch (err) {
      setError(err.message);
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
              <Nav.Link onClick={() => navigate("/user-profile")}>Back to profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title className="mb-4">Post a New Deal</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Deal Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={deal.title}
                      onChange={handleChange}
                      placeholder="Enter deal title"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={deal.description}
                      onChange={handleChange}
                      placeholder="Describe your deal"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="expirationDate"
                      value={deal.expirationDate}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {error && <p className="text-danger">{error}</p>}

                  <Button type="submit" variant="primary">Post Deal</Button>
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
        <Modal.Body>Your deal was posted successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => navigate("/deals-page")}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '350px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', top: 500, right: 0, width: '350px', height: '300px', backgroundImage: `url(${backgroundBottom})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', top: 10, right: 1350, width: '250px', height: '750px', backgroundImage: `url(${backgroundIv})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
    </div>
  );
}

export default PostDealPage;
