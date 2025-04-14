import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";

const MessagesPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
    const res = await fetch(`http://localhost:3000/api/messages/${companyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ content: newMessage })
    });

    if (res.ok) {
      const newMsg = await res.json();
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Messages with {company?.name}</h2>
      <Card className="p-3 mb-3">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender === "user" ? "You" : company.name}:</strong> {msg.content}
          </div>
        ))}
      </Card>
      <Form.Group>
        <Form.Control
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
      </Form.Group>
      <Button className="mt-2" onClick={handleSend}>Send</Button>
    </Container>
  );
};

export default MessagesPage;
