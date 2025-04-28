import React, { useEffect, useState } from "react";
import {
  Container, Card, Navbar, Nav, Spinner, Button
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logoImage from "../Assets/Logo3.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundBottom from "../Assets/nobackground.png";
import backgroundIv from "../Assets/about-background.png";

const dummyData = {
  "dummy1": {
    name: "Alice Demo",
    messages: [
      { fromMe: false, text: "Hi there! I love your company’s profile!", timestamp: "2025-04-23 10:00 AM" },
      { fromMe: true, text: "Thank you, Alice!", timestamp: "2025-04-23 10:05 AM" }
    ]
  },
  "dummy2": {
    name: "Bob Placeholder",
    messages: [
      { fromMe: false, text: "Can we collaborate on a deal?", timestamp: "2025-04-22 02:00 PM" },
      { fromMe: true, text: "Sure, happy to discuss more!", timestamp: "2025-04-22 02:15 PM" }
    ]
  }
};

const MessagesGroupedPage = () => {
  const [groupedMessages, setGroupedMessages] = useState({
    sentMessages: [],
    receivedMessages: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  

  useEffect(() => {
    console.log("Component mounted, fetching messages...");
    const fetchGroupedMessages = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const businessId = localStorage.getItem("businessId");
  
      if (!token || !userId) {
        console.error("Token or userId is missing from localStorage");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching messages for user ID:", userId, "at business ID:", businessId);
        const res = await fetch(`http://localhost:3000/api/messages/user/${userId}/business/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Response status:", res);
  
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }
  
        const data = await res.json();
        console.log("Fetched messages:", data);

       // Use the groupedMessages directly from the API response
      const groupedMessages = data.sortedGroupedMessages || {};
      console.log("Grouped Messages:", groupedMessages);

     // console.log("Dummy Data:", dummyData);
      setGroupedMessages(groupedMessages);
      } catch (err) {
        console.error("Failed to load grouped messages:", err);
        setGroupedMessages(dummyData); // fallback on error too
      } finally {
        setLoading(false);
      }
    };


    fetchGroupedMessages();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

  // Paginate the groupedMessages
  const paginatedMessages = Object.entries(groupedMessages).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-signup");
  };

  const handleClick = (path) => {
    const pathname = path === "home" ? "/" :
      path === "opportunities" ? "/opportunities-page"
        : path === "profile" ? "/user-profile" :
          path === "companies" ? "/companies-page" :
            path === "deals" ? "/deals-page" : "/";
    navigate(pathname);
  };

  return (
    
    <>
    
      {/* Backgrounds */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '200px', height: '300px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 500, right: -50, width: '500px', height: '310px', backgroundImage: `url(${backgroundBottom})`, backgroundSize: 'cover', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 500, left: -50, width: '150px', height: '400px', backgroundImage: `url(${backgroundIv})`, backgroundSize: 'cover', zIndex: 999 }} />

      <div className="min-vh-100 position-relative">
        {/* Navbar */}
        <Navbar bg="light" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
              <img src={logoImage} alt="Logo" style={{ width: '80px' }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link onClick={() => handleClick("home")}>Home</Nav.Link>
                <Nav.Link onClick={() => handleClick("companies")}>Companies</Nav.Link>
                <Nav.Link onClick={() => handleClick("opportunities")}>See Opportunities</Nav.Link>
                <Nav.Link onClick={() => handleClick("deals")}>See Deals</Nav.Link>
                <Nav.Link onClick={() => handleClick("profile")}>My Profile</Nav.Link>
              </Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Page Content */}
        <Container className="py-5">
          <h2 className="mb-4 text-center">Conversations</h2>
          {loading ? (
  <div className="d-flex justify-content-center">
    <Spinner animation="border" />
  </div>
) : Object.keys(groupedMessages).length > 0 ? (
  <>
  {paginatedMessages.map(([userId, { name, messages }]) => (
      <Card key={userId} className="my-3 shadow-sm">
        <Card.Body>
          <Card.Title className="text-primary">{name}</Card.Title>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${msg.fromMe ? "text-end" : "text-start"}`}
            >
              <strong>{msg.fromMe ? "You" : name}:</strong> {msg.text}
              <br />
              <small className="text-muted">{msg.timestamp}</small>
              <hr />
            </div>
          ))}
        </Card.Body>
      </Card>
    ))}
    {Object.keys(groupedMessages).length > itemsPerPage && (
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="mx-3 align-self-center">
          Page {currentPage} of {Math.ceil(Object.keys(groupedMessages).length / itemsPerPage)}
        </span>
        <Button
          variant="outline-primary"
          disabled={currentPage * itemsPerPage >= Object.keys(groupedMessages).length}
          onClick={() =>
            setCurrentPage((prev) =>
              prev * itemsPerPage < Object.keys(groupedMessages).length ? prev + 1 : prev
            )
          }
        >
          Next
        </Button>
      </div>
    )}
  </>
) : (
  <div className="text-center">
    <p>No conversations found.</p>
  </div>
)}



        </Container>
      </div>
    </>
  );
};

export default MessagesGroupedPage;
