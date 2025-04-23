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
  const [groupedMessages, setGroupedMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGroupedMessages = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const res = await fetch(`http://localhost:3000/api/messages/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      const { sentMessages, receivedMessages } = data;

      const grouped = {};

      [...sentMessages, ...receivedMessages].forEach(msg => {
        const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const otherUserName = msg.senderId === userId ? msg.receiverName : msg.senderName;

        if (!grouped[otherUserId]) {
          grouped[otherUserId] = {
            name: otherUserName,
            messages: []
          };
        }

        grouped[otherUserId].messages.push({
          fromMe: msg.senderId === userId,
          text: msg.message,
          timestamp: new Date(msg.timestamp).toLocaleString()
        });
      });

      // Use dummy data if no messages
      setGroupedMessages(Object.keys(grouped).length ? grouped : dummyData);
    } catch (err) {
      console.error("Failed to load grouped messages:", err);
      setGroupedMessages(dummyData); // fallback on error too
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedMessages();
  }, []);

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
          ) : (
            Object.entries(groupedMessages).map(([userId, { name, messages }]) => (
              <Card key={userId} className="my-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">{name}</Card.Title>
                  {messages.map((msg, idx) => (
                    <div key={idx} className="mb-2">
                      <strong>{msg.fromMe ? "You" : name}:</strong> {msg.text}
                      <br />
                      <small className="text-muted">{msg.timestamp}</small>
                      <hr />
                    </div>
                  ))}
                </Card.Body>
              </Card>
            ))
          )}
        </Container>
      </div>
    </>
  );
};

export default MessagesGroupedPage;
