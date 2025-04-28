import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Card, Form, Button, Navbar, Nav
} from "react-bootstrap";

import logoImage from "../Assets/Logo3.png";
import backgroundPeopleImage from "../Assets/nobackground.png";
import backgroundIv from "../Assets/about-background.png";
import backRightImage from "../Assets/home-banner-background.png";

const MessagesPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      const res = await fetch(`http://localhost:3000/api/business/${companyId}`);
      const data = await res.json();
      setCompany(data);
    };

    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:3000/api/messages/${companyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setMessages(data);
    };

    fetchCompany();
    fetchMessages();
  }, [companyId]);


  const handleSend = async () => {
    const res = await fetch(`http://localhost:3000/api/messages/${companyId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        senderId: localStorage.getItem("businessId"),
        receiverId: companyId,
        message: newMessage,
        companyId
      })
    });
  
    if (res.ok) {
      const data = await res.json();
      setMessages(prev => [...prev, data.message]); //  `data.message`
      setNewMessage("");
    }
  };
  

  return (
    <>
      {/* Background decorations */}
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
                <Nav.Link onClick={() => navigate("/deals-page")}>See Deals</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-5">
          <h2 className="mb-4 text-center">Chatting with {company?.name}</h2>
          <Card className="p-3 shadow-sm mb-4">
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <strong>{msg.senderName || "Unknown"}:</strong> {msg.message || msg.content}
                  </div>
                ))
              )}
            </div>
          </Card>
          <Form.Group>
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
          </Form.Group>
          <Button className="mt-2" onClick={handleSend} variant="primary">Send</Button>
        </Container>
      </div>
    </>
  );
};

export default MessagesPage;