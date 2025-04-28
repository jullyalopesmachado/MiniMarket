import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Navbar,
  Nav,
  Modal,
  Button,
  Pagination
} from "react-bootstrap";

import logoImage from "../Assets/Logo3.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundBottom from "../Assets/delivery-image-Photoroom.png";

const CompanyPostsPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [deals, setDeals] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [currentDealsPage, setCurrentDealsPage] = useState(1);
  const [currentOppsPage, setCurrentOppsPage] = useState(1);
  const itemsPerPage = 2;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    

    const fetchCompany = async () => {
try {
      const res = await fetch(`http://localhost:3000/api/business/owned`, {
        method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch company: ${res.statusText}`);
    }

      const data = await res.json();
      console.log("Company Data:", data);
      setCompany(data);
      
  } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  fetchCompany();
}, []);

  useEffect(() => {
    if (!company) return; // Ensure companyId is available
    let filtered = [];

    const token = localStorage.getItem("token");

    const fetchDeals = async () => {
      const res = await fetch("http://localhost:3000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
      const data = await res.json();
      console.log("Deals Data:", data);

      if (!company || !company.owner) {
        console.error("Company or owner ID is not available.");
        return;
      }
      
      
      filtered = data.filter(deal =>
        deal.user && String(deal.user._id || deal.user) === String(company.owner)
      );
      console.log("Filtered Deals:", filtered);
      setDeals(filtered);
    };

    const fetchOpportunities = async () => {
      const res = await fetch("http://localhost:3000/api/opportunities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
      const data = await res.json();
      console.log("Opportunities Data:", data);

      if (!company || !company._id) {
        console.error("Company or owner ID is not available.");
        return;
      }
      
// Log each opportunity to verify the structure
data.forEach((opp) => console.log("Opportunity Object:", opp));

// Handle cases where data is not an array or is undefined
if (!Array.isArray(data)) {
  console.error("Invalid opportunities data format.");
  return;
}

// Filter opportunities by businessId matching company._id
const filtered = data.filter(opp =>
  opp.businessId && String(opp.businessId._id || opp.businessId) === String(company._id)
);
      console.log("Filtered Opportunities:", filtered);
      setOpportunities(filtered);
    };


      fetchDeals();
      fetchOpportunities();
  }, [company]);

  const handleShowModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  }; 

  const indexOfLastDeal = currentDealsPage * itemsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - itemsPerPage;
  const currentDeals = deals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalDealsPages = Math.ceil(deals.length / itemsPerPage);

  const indexOfLastOpp = currentOppsPage * itemsPerPage;
  const indexOfFirstOpp = indexOfLastOpp - itemsPerPage;
  const currentOpps = opportunities.slice(indexOfFirstOpp, indexOfLastOpp);
  const totalOppsPages = Math.ceil(opportunities.length / itemsPerPage);

  return (
    <>
      {/* Background Decorations */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '200px', height: '300px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 500, right: -50, width: '500px', height: '310px', backgroundImage: `url(${backgroundBottom})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 400, left: -50, width: '150px', height: '400px', backgroundImage: `url(${backgroundIv})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', zIndex: 999 }} />

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

        <Container className="mt-5">
          <h3 className="mb-4 text-center">Posts by {company?.name || "Company"}</h3>

          <h5 className="mt-4">Deals</h5>
          <Row>
            {currentDeals.length > 0 ? currentDeals.map((deal) => (
              <Col md={6} key={deal._id} className="mb-4">
                <Card className="text-center shadow-sm">
                  <Card.Body>
                  <Card.Title>{deal.text?.split("\n")[0] || "No Title"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Expires on {new Date(deal.expirationDate).toLocaleDateString()}</Card.Subtitle>
                    <Button variant="outline-primary" onClick={() => handleShowModal(deal)}>
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )) : (
              <p>No deals found.</p>
            )}
          </Row>
          {totalDealsPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.First onClick={() => setCurrentDealsPage(1)} disabled={currentDealsPage === 1} />
              <Pagination.Prev onClick={() => setCurrentDealsPage(prev => Math.max(prev - 1, 1))} disabled={currentDealsPage === 1} />
              {[...Array(totalDealsPages)].map((_, i) => (
                <Pagination.Item key={i + 1} active={i + 1 === currentDealsPage} onClick={() => setCurrentDealsPage(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentDealsPage(prev => Math.min(prev + 1, totalDealsPages))} disabled={currentDealsPage === totalDealsPages} />
              <Pagination.Last onClick={() => setCurrentDealsPage(totalDealsPages)} disabled={currentDealsPage === totalDealsPages} />
            </Pagination>
          )}

          <h5 className="mt-4">Opportunities</h5>
          <Row>
            {currentOpps.length > 0 ? currentOpps.map((opp) => (
              <Col md={6} key={opp._id} className="mb-4">
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <Card.Title>{opp.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{opp.type}</Card.Subtitle>
                    <Button variant="outline-primary" onClick={() => handleShowModal(opp)}>
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )) : (
              <p>No opportunities found.</p>
            )}
          </Row>
          {totalOppsPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.First onClick={() => setCurrentOppsPage(1)} disabled={currentOppsPage === 1} />
              <Pagination.Prev onClick={() => setCurrentOppsPage(prev => Math.max(prev - 1, 1))} disabled={currentOppsPage === 1} />
              {[...Array(totalOppsPages)].map((_, i) => (
                <Pagination.Item key={i + 1} active={i + 1 === currentOppsPage} onClick={() => setCurrentOppsPage(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentOppsPage(prev => Math.min(prev + 1, totalOppsPages))} disabled={currentOppsPage === totalOppsPages} />
              <Pagination.Last onClick={() => setCurrentOppsPage(totalOppsPages)} disabled={currentOppsPage === totalOppsPages} />
            </Pagination>
          )}
        </Container>

        {/* Modal for Details */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
          <Modal.Title>{selectedPost?.text?.split("\n")[0]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPost?.description && (
              <p><strong>Description:</strong> {selectedPost.description}</p>
            )}
            {selectedPost?.expirationDate && (
              <p><strong>Expires on:</strong> {new Date(selectedPost.expirationDate).toLocaleDateString()}</p>
            )}
            {selectedPost?.type && (
              <p><strong>Type:</strong> {selectedPost.type}</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CompanyPostsPage;
