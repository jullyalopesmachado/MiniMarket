<<<<<<< HEAD
// Importing React and useState hook for managing component state
=======
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container, Row, Col, Button, Dropdown, Card,
  Form, Nav, Navbar, Modal
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { fetchData } from "./api";


export function CompanyList({user}) { // Passing isAdmin as a prop here.
      const [userStatus, setUserStatus] = useState("User not logged in");
    
=======

import logoImage from "../Assets/Logo3.png";
import companyPhoto from "../Assets/compphoto1.png";
import backgroundImage from "../Assets/home-banner-background.png";
import backgroundIv from "../Assets/about-background.png";
import backgroundBottom from "../Assets/bottom-background.png";
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c

export function CompanyList({ user }) {
  const [userStatus, setUserStatus] = useState("User not logged in");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [messagem, setMessage] = useState("");
  const navigate = useNavigate();

<<<<<<< HEAD
    const [companies, setCompanies] = useState([]); // State to hold the initial list of companies

    useEffect(() => {
        const fetchBusinesses = async () => {
            const data = await fetchData({ action: "business" });
            setCompanies(data);
        };
        fetchBusinesses();
    }, []);

    const  [showMessageModal, setShowMessageModal] = useState(false); // State to control the visibility of the message modal
    const [selectedCompany, setSelectedCompany] = useState(null); // State to hold the selected company for messaging
    const [messagem, setMessage] = useState(""); // State to hold the message content
    const navigate = useNavigate();
    
    const handleMessageClick = (company) => {
        if (user){ // Check if the user is logged in
            alert ("You're about to send a message.");
            // Redirect to login page
        } else {
            setSelectedCompany(company); // Set the selected company for messaging
            setShowMessageModal(true); // Show the message modal
        }
    };

    const handleCloseModal  = () => {   
        setShowMessageModal(false); // Close the message modal
        setMessage(""); // Reset the message content
    };

    const handleSendMessage = async () => {  
        if (!messagem.trim()){
            alert ("Please enter a message."); // Alert if the message is empty
            return; 

        }

        try {

            // This is assuming there's an API endpoint to send a message to
            const response = await fetch( `/api/inbox/${selectedCompany.id}/message`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token for authentication
                },
                body: JSON.stringify({message}),
            });

            if (response.ok) {
                alert("Message sent successfully!"); // Alert on successful message sending 
                handleCloseModal(); // Close the modal
            } else {    
                alert("Failed to send message.");

            }
        } catch (error) {
            console.error("Error sending message:", error); // Log any errors that occur during the fetch
        }
    };

// /////////////////////////////////////////////

    const handleEditToggle = (id) => {
        if (user?.isAdmin || userStatus === "Admin logged in") { // Check if the user is an admin
            setCompanies(companies.map(company =>
                company.id === id ? { ...company, isEditing: !company.isEditing } : company 
            ));
        } else {
            alert("Only admnis can edit company details.");
        }
};


    // The handleEditToggle function below does the following:
    // map() function iterates over all companies in the companies array. 
    // For each company, we check if its id matches the id passed to the function.
    // If there's a match, we create a new object for that company, keeping all its properties unchanged 
    // using the spread operator (...company), and we toggle its isEditing property.
    // If the company.id doesn't match, we return the company without changes.
    // The updated array is then passed to setCompanies() to update the state.
    

    // Function to save the edited data
    //  (this would eventually send the data to the backend)
    const handleSave = (id, companyName, companyBio, companyLocation, companyWebsite) => {
        // Here I will later send the updated data to the backend
        // For now, I'll just log it to the console
        console.log("Saved data for company: ", {companyName, companyBio, companyLocation, companyWebsite});

        // Update the companies state to reflect the changes
        // Use the map() function to iterate over all companies in the companies array
        setCompanies(companies.map(company =>
            // Check if the current company's id matches the id we're trying to update
            company.id === id ? 
                // If the id matches, create a new object with updated properties
                {
                    ...company, // Spread the existing properties of the company
                    companyName, // Update the company name
                    companyBio, // Update the company bio
                    companyLocation, // Update the company location
                    companyWebsite, // Update the company website
                    isEditing: false // Set editing mode to false after saving the changes
                }
                : 
                // If the id doesn't match, return the company unchanged
                company
        ));
        // After map() finishes, setCompanies() updates the state with the new companies array
=======
  const fetchCompany = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/business", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const companyData = await response.json();
      console.log("Fetched Companies:", companyData);

      setCompanies(companyData.map(company => ({
        id: company._id,
        companyPhoto: null,
        companyName: company.name,
        companyBio: company.description,
        companyLocation: company.location,
        companyWebsite: company.website || "N/A",
        companyEmail: company.email || "",
        isEditing: false,
      })));
    } catch (error) {
      console.error("Error fetching companies:", error.message);
      setError("Failed to load company data.");
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleEditToggle = (id) => {
    if (user?.isAdmin || userStatus === "Admin logged in") {
      setCompanies(companies.map(company =>
        company.id === id ? { ...company, isEditing: !company.isEditing } : company
      ));
    } else {
      alert("Only admins can edit company details.");
    }
  };

  const handleSave = async (id) => {
    const companyToUpdate = companies.find(company => company.id === id);
    const token = localStorage.getItem("token");

    if (!companyToUpdate.companyName || !companyToUpdate.companyBio || !companyToUpdate.companyLocation) {
      alert("Company name, bio, and location are required.");
      return;
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c
    }

    const payload = {
      name: companyToUpdate.companyName,
      description: companyToUpdate.companyBio,
      website: companyToUpdate.companyWebsite,
      location: companyToUpdate.companyLocation,
      email: companyToUpdate.companyEmail || "example@example.com"
    };

    try {
      const response = await fetch(`http://localhost:3000/api/business/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save changes");

      setCompanies(companies.map(company =>
        company.id === id ? { ...company, isEditing: false } : company
      ));
      alert("Company updated successfully!");
    } catch (error) {
      console.error("Error saving company:", error);
      alert("Error saving company changes.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserStatus("User not logged in");
    navigate("/login-signup");
  };

  const handleMessageClick = (company) => {
    if (user) {
      alert("You're about to send a message.");
    } else {
      setSelectedCompany(company);
      setShowMessageModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (!messagem.trim()) {
      alert("Please enter a message.");
      return;
    }

    try {
      const response = await fetch(`/api/companies/${selectedCompany.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: messagem }),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        handleCloseModal();
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-vh-100 w-100 position-relative">

<<<<<<< HEAD
            {/* Company List Section */}
            <Container className="mt-4">
                <Row >
                    {/* Loop through each company and render a card for each */}

                {loading ? (
                    <p>Loading companies...</p>
                ) : (
                companies && companies.length > 0 ? (
                    companies.map((company) => (
                        <Col md={4} key={company.id}>
                            <Card style={{ width: "19rem" }} className="mb-5">
                                <Card.Img variant="top" src={company.companyPhoto} />
                                {/* This line displays the company's logo image at the top of the card using the 'logoImage' variable */}
                                <Card.Body>
                                    {/* Start of the card body where the company information is displayed */}
                                    {/* Ternary operator to toggle between editing and viewing mode */}
                                    {company.isEditing ? (
                                        <>
                                            {/* If the company is in editing mode, display form fields for company info */}
                                            {/* Form group for the company name */}
                                            <Form.Group className="mb-2">
                                                {/* Label for the company name field */}
                                                <Form.Label>Company Name</Form.Label>
                                                {/* Input field to edit the company name */}
                                                <Form.Control
                                                    type="text" // Specifies this is a text input field (for entering text)
                                                    value={company.companyName} // The value of this input field is the current company name from the 'company' object
                                                    onChange={(e) => setCompanies(companies.map(c => 
                                                        // When the value of the input changes (i.e., when the user types something):
                                                        c.id === company.id ? { 
                                                            ...c, // Spread the existing properties of the company (so we don't change other properties)
                                                            companyName: e.target.value // Update the company name with the new value typed by the user
                                                        } : c // If the company ID doesn't match, return the company unchanged
                                                    ))}
                                                />
                                            </Form.Group>
=======
      {/* ✅ Navbar with conditional links */}
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
            <img src={logoImage} alt="Logo" style={{ width: '80px' }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c

              {(userStatus === "User logged in" || userStatus === "Admin logged in") && (
                <>
                  <Nav.Link onClick={() => navigate("/user-profile")}>Profile</Nav.Link>
                  <Nav.Link onClick={() => navigate("/companies-page")}>Companies</Nav.Link>
                  <Nav.Link onClick={() => navigate("/opportunities-page")}>See Opportunities</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Company Cards */}
      <Container className="mt-5">
        <Row>
          {companies.map(company => (
            <Col md={4} key={company.id}>
              <Card style={{ width: "19rem" }} className="mb-5">
                <Card.Img variant="top" src={companyPhoto} />
                <Card.Body>
                  {company.isEditing ? (
                    <>
                      <Form.Group className="mb-2">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={company.companyName}
                          onChange={(e) => setCompanies(companies.map(c =>
                            c.id === company.id ? { ...c, companyName: e.target.value } : c
                          ))}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Company Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          value={company.companyBio}
                          onChange={(e) => setCompanies(companies.map(c =>
                            c.id === company.id ? { ...c, companyBio: e.target.value } : c
                          ))}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Company Location</Form.Label>
                        <Form.Control
                          type="text"
                          value={company.companyLocation}
                          onChange={(e) => setCompanies(companies.map(c =>
                            c.id === company.id ? { ...c, companyLocation: e.target.value } : c
                          ))}
                        />
                      </Form.Group>

<<<<<<< HEAD
                                            
                                            {/*}
                                            // This line BELOW conditionally renders the "Edit" button only if the user is an admin.
                                            // The 'isAdmin' prop is a boolean. If it is true, the button is displayed.
                                            // The button has a 'warning' variant (yellow color), a margin on the left (ms-2),
                                            // and when clicked, it triggers the 'handleEditToggle' function with the company id.
                                            // This function toggles the 'isEditing' state for the specific company, allowing the user to enter edit mode.
                                            */}
                                            {user?.isAdmin || userStatus === "Admin logged in" && (
                                                <Button variant="outline-primary" className="ms-2" onClick={() => handleEditToggle(company.id)}>
                                                    Edit
                                                </Button>
                                            )}
                                                                                    {/* If the user is an admin (i.e., isAdmin is true), show an "Edit" button.
                                                Clicking it sets isEditing to true, which would switch to editing mode */}
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No companies found</p>
                ))}
                </Row>
            </Container>
=======
                      <Form.Group className="mb-2">
                        <Form.Label>Company Website</Form.Label>
                        <Form.Control
                          type="text"
                          value={company.companyWebsite}
                          onChange={(e) => setCompanies(companies.map(c =>
                            c.id === company.id ? { ...c, companyWebsite: e.target.value } : c
                          ))}
                        />
                      </Form.Group>
>>>>>>> 94e26e5398b5cb181f3367076c0c63e22a55aa2c

                      <Button variant="primary" onClick={() => handleSave(company.id)}>Save</Button>
                    </>
                  ) : (
                    <>
                      <Card.Title>{company.companyName}</Card.Title>
                      <Card.Text>{company.companyBio}</Card.Text>
                      <Card.Text><strong>Location:</strong> {company.companyLocation}</Card.Text>
                      <Card.Text><strong>Website:</strong>{" "}
                        <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">
                          {company.companyWebsite}
                        </a>
                      </Card.Text>

                      {(user || userStatus !== "User not logged in") && (
                        <Button variant="primary" onClick={() => handleMessageClick(company)}>Message</Button>
                      )}

                      {(user?.isAdmin || userStatus === "Admin logged in") && (
                        <Button variant="outline-primary" className="ms-2" onClick={() => handleEditToggle(company.id)}>
                          Edit
                        </Button>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message to {selectedCompany?.companyName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={messagem}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSendMessage}>Send Message</Button>
        </Modal.Footer>
      </Modal>

      {/* Background Decorations */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '200px',
        height: '300px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        zIndex: 999
      }} />
      <div style={{
        position: 'fixed',
        top: 500,
        right: 2,
        width: '300px',
        height: '300px',
        backgroundImage: `url(${backgroundBottom})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        zIndex: 999
      }} />
      <div style={{
        position: 'fixed',
        top: 400,
        left: -35,
        width: '150px',
        height: '400px',
        backgroundImage: `url(${backgroundIv})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        zIndex: 999
      }} />
    </div>
  );
}

export default CompanyList;
