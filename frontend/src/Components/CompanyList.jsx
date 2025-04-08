// Importing React and useState hook for managing component state
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Dropdown, Alert, Breadcrumb, Card, Form, Nav, Navbar, NavDropdown, NavbarCollapse, Modal } from 'react-bootstrap';
import logoImage from "../Assets/Logo3.png"; 
import crochetImage from "../Assets/crochetPic.jpg"; 
import honeyImage from "../Assets/honeyShopPhoto2.jpg"; 
import breadImage from "../Assets/breadShopPhoto3.jpg"; 
import produceImage from "../Assets/shopphoto.jpg"; 
import veggiesImage from "../Assets/shopPhoto1.jpg"; 
import peachesImage from "../Assets/peachesPhoto.jpg"; 
import background from "../Assets/home-banner-background.png"; 
import backgroundIv from "../Assets/about-background.png"; 
import backgroundBottom from "../Assets/bottom-background.png"; 

import companyPhoto from "../Assets/compphoto1.png";

import backgroundImage from "../Assets/home-banner-background.png"; 
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
export function CompanyList({user}) { 
        // Passing isAdmin as a prop here.
        const [userStatus, setUserStatus] = useState("User not logged in");


        const handleSignupClick = () => {
          if (userStatus === "User not logged in") {
            navigate("/login-signup");
          }
        };
      

    const [isEditing, setIsEditing] = useState(false);
    const [companyName, setCompanyName] = useState("Layne");
    const [companyBio, setCompanyBio] = useState(null);
    const [companyStreet, setCompanyStreet] = useState(null);
    const [companyCity, setCompanyCity] = useState(null);
    const [companyState, setCompanyState] = useState(null);
    const [companyCountry, setCompanyCountry] = useState(null);
    const [companyWebsite, setCompanyWebsite] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false); // tracks loading
    const [error, setError] = useState(null); // tracks error
    
    
    const fetchCompany = async () => {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
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
    
            // Update the companies state with fetched data
            setCompanies(companyData.map(company => ({
                id: company._id,  // MongoDB _id
                companyPhoto: null,  // You need to add image URLs in the backend
                companyName: company.name,
                companyBio: company.description,
                companyLocation: company.location, 
                companyWebsite: company.website || "N/A",
                isEditing: false, // Default editing state
            })));
        } catch (error) {
            console.error("Error fetching companies:", error.message);
            setError("Failed to load company data.");
        }
    };
    
    // Fetch companies when the component mounts
    useEffect(() => {
        fetchCompany();
    }, []);
    


    const [companies, setCompanies] = useState([ 

        // sample data until backend is connected here
        {
            id: '',
            companyPhoto: '',
            companyName: "",
            companyBio: "",
            companyLocation: "",
            companyWebsite: "",
            isEditing: "", // State to track if the company is being edited
        },

    ]); // State to hold the initial list of companies

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
            const response = await fetch( `/api/companies/${selectedCompany.id}/message`, {
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
    const handleSave = (id) => {
        setCompanies(companies.map(company => 
            company.id === id ? { ...company, isEditing: false } : company
        ));
    };
    

    // log out handler
    const handleLogout = () => {
        //remove token from local storage
        localStorage.removeItem("token");
        // now redirect user to the login page
        navigate("/login-signup");  
    }



    return (
        <div className="min-vh-100 w-100">
            {/* Navbar Section */}
            <Navbar expand="lg" className="img-fluid">
                <Container className="mt-4"              style={{ 

                backgroundSize: '130px',  // Adjust to your preferred smaller size
                backgroundPosition: 'right', // Keep the image aligned to the left
                backgroundRepeat: 'no-repeat' // Ensure the image doesn't repeat
            }}>
                <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{width: '10%'}}  />
                    <Navbar.Toggle aria-controls="basic-navbar" className="me-auto"  />
                    <Navbar.Collapse id="basic-navbar-nav" className="me-auto img-fluid">
                        <Nav className="ms-auto" >
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Company List Section */}
            <Container className="mt-4">
                <Row >
                    {/* Loop through each company and render a card for each */}
                    {companies.map(company => (
                        <Col md={4} key={company.id}>
                            <Card style={{ width: "19rem" }} className="mb-5">
                                <Card.Img variant="top" src={companyPhoto} />
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

                                            <Form.Group className="mb-2">

                                                
                                                <Form.Label>Company Bio</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    value={company.companyBio}
                                                    // Update company bio on change
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
                                                    // Update company location on change
                                                    onChange={(e) => setCompanies(companies.map(c =>
                                                        c.id === company.id ? { ...c, companyLocation: e.target.value } : c
                                                    ))}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-2">
                                                <Form.Label>Company Website</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={company.companyWebsite}
                                                    // Update company website on change
                                                    onChange={(e) => setCompanies(companies.map(c =>
                                                        c.id === company.id ? { ...c, companyWebsite: e.target.value } : c
                                                    ))}
                                                />
                                            </Form.Group>

                                            {/* Button to save the changes */}
                                            <Button variant="primary" onClick={() => handleSave(company.id, company.companyName, company.companyBio, company.companyLocation, company.companyWebsite)}>Save</Button>
                                        </>
                                    ) : (
                                        // This is called the ternary operator, an if-else shorthand:
                                        // condition ? expression_if_true : expression_if_false.
                                        // The code below is rendered if isEditing is false!
                                        <>
                                            {/* When not in editing mode, render the company's details */}
                                            <Card.Title>{company.companyName}</Card.Title> 
                                            {/* Display the company name inside a Card title */}
                                        
                                            <Card.Text>{company.companyBio}</Card.Text> 
                                            {/* Display the company bio inside a paragraph (Card text) */}
                                        
                                            <Card.Text><strong>Location:</strong>{company.companyLocation}</Card.Text> 
                                            {/* Display the company's location with a label "Location:" */}
                                        
                                            <Card.Text><strong>Website:</strong><a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">{company.companyWebsite}</a></Card.Text>
                                            {/* Display the company's website as a clickable link. It opens in a new tab. 
                                                `rel="noopener noreferrer"` ensures security when opening links in a new tab */}
                                            
                                            {/* A button that says "Message", presumably for contacting the company */}
                                            
                                            {user || userStatus !== "User not logged in" && (
                                                <Button variant="primary" onClick={() => handleMessageClick(company)}>Message</Button>
                                            )}

                                            
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
                    ))}
                </Row>
            </Container>

            {/* Message Modal Section */}

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
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    
                    <Button variant="primary" onClick={handleSendMessage}>
                        Send Message
                    </Button>
                </Modal.Footer>
            </Modal>

      {/* User Status Dropdown */}
      <Dropdown style={{ position: "absolute", top: "100px", right: "150px" }}>
    <Dropdown.Toggle variant="primary">{userStatus}</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item onClick={() => setUserStatus("User logged in")}>User logged in</Dropdown.Item>
        <Dropdown.Item onClick={() => setUserStatus("Admin logged in")}>Admin logged in</Dropdown.Item>
        <Dropdown.Item onClick={() => setUserStatus("User not logged in")}>User not logged in</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown>
            

{/* Background image positioned in the top-right corner of the navbar */}
<div
                                            style={{
                                            position: 'absolute',  // Positioning it within the navbar
                                            top: 0,
                                            right: 0,
                                            width: '150px',  // Set a small size for the background image
                                            height: '350px',  // Set a small size for the background image
                                            backgroundImage: `url(${backgroundImage})`,  // Background image URL
                                            backgroundSize: 'cover',  // Ensure the background image covers the div
                                            backgroundRepeat: 'no-repeat',  // Prevent repeating the image
                                            }}
                                />

                                <div
                                            style={{
                                            position: 'absolute',  // Positioning it within the navbar
                                            top: 500,
                                            right: 0,
                                            width: '350px',  // Set a small size for the background image
                                            height: '300px',  // Set a small size for the background image
                                            backgroundImage: `url(${backgroundBottom})`,  // Background image URL
                                            backgroundSize: 'cover',  // Ensure the background image covers the div
                                            backgroundRepeat: 'no-repeat',  // Prevent repeating the image
                                            }}
                                />
                
                                        <div
                                            style={{
                                            position: 'absolute',  // Positioning it within the navbar
                                            top: 10,
                                            right: 1350,
                                            width: '250px',  // Set a small size for the background image
                                            height: '750px',  // Set a small size for the background image
                                            backgroundImage: `url(${backgroundIv})`,  // Background image URL
                                            backgroundSize: 'cover',  // Ensure the background image covers the div
                                            backgroundRepeat: 'no-repeat',  // Prevent repeating the image
                                            }}
                                />                  



        </div>
    );
};

export default CompanyList;
