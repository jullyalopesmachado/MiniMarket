import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Pagination, Navbar, NavDropdown } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import backgroundPeopleImage from '../Assets/about-background-image.png'; // Import background image asset
import backgroundIv from '../Assets/about-background.png'; // Import background image asset
import logoImage from "../Assets/Logo3.png";
import backRightImage from "../Assets/home-banner-background.png";
function OppListPage() {
    
    // State to store fetched opportunities
    const [opportunities, setOpportunities] = useState([]);
    // State to track the current page in pagination
    const [currentPage, setCurrentPage] = useState(1);
    // Number of items to display per page
    const itemsPerPage = 2;
    // React Router hook for navigation (not currently used in this component)
    const navigate = useNavigate();
    // State to manage user status in the dropdown menu
    const [userStatus, setUserStatus] = useState("User logged in");

    // Fetch opportunities from an API when the component mounts
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await fetch("birb"); // API URL for opportunities
                const data = await response.json();
                setOpportunities(data); // Store the fetched data in state
            } catch (error) {
                console.error("Error fetching opportunities:", error);
            }
        };
        fetchOpportunities();
    }, []);

    // Calculate pagination indexes
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Get the items for the current page
    const currentItems = opportunities.slice(indexOfFirstItem, indexOfLastItem);
    // Calculate the total number of pages needed
    const totalPages = Math.ceil(opportunities.length / itemsPerPage);

    // Handle page change when a user clicks a pagination button
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-vh-100 w-100">
    
        {/* Navigation Bar */}
        <Container className="mt-4 d-flex justify-content-start align-items-center">
            <Navbar expand="lg">
                <Container className="mt-4 d-flex justify-content-start align-items-center">

                    {/* Logo and Navbar */}
                    <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: '15%' }} />
                    <Navbar.Toggle aria-controls="basic-navbar" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/* Display navigation options based on user status */}
                            {(userStatus === "User logged in" || userStatus === "Admin logged in") && (
                                <>
                                    <Button variant="outline-success" className="ms-4" onClick={() => navigate("/")}>Home</Button>
                                    <Button variant="outline-success" className="ms-4" onClick={() => navigate("/profilePage")}>Profile</Button>
                                    <Button variant="outline-success" className="ms-4" onClick={() => navigate("/userListPage")}>Users</Button>
      
                                </>
                            )}
                        </Nav>

                        <Nav className="me-auto">
                            {userStatus === "Admin logged in" && (
                                <NavDropdown title="Administrator">
                                    <NavDropdown.Item onClick={() => navigate('/adminPanelOp')}>Approve Opportunity</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => navigate('/adminPanelUser')}>Approve User</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
        {/* Profile Card */}

            {/* Opportunities Section - Display available opportunities */}
            <Container className="mt-5">
                <Row>
                    {currentItems.map((opportunity) => (
                        <Col key={opportunity._id} md={6} className="mb-4">
                            <Card className="text-center">
                                {/* Opportunity Type */}
                                <Card.Header>{opportunity.type.toUpperCase()}</Card.Header>
                                <Card.Body>
                                    {/* Title and Description */}
                                    <Card.Title>{opportunity.title}</Card.Title>
                                    <Card.Text>{opportunity.description}</Card.Text>
                                    {/* Button to view details (currently non-functional) */}
                                    <Button
                                        variant="outline-success"
                                        onClick={() => navigate(`/opportunity/${opportunity._id}`)} // Navigate to OpportunityDetailPage
                                    >
                                        View Details
                                    </Button>
                                </Card.Body>
                                {/* Footer with posted by information */}
                                <Card.Footer className="text-muted">
                                    Posted by {opportunity.posted_by} on {new Date(opportunity.createdAt).toLocaleDateString()}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Pagination - Controls for navigating between pages */}
                {totalPages > 1 && (
                    <Pagination className="justify-content-center mt-4">
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

                        {/* Create pagination buttons dynamically based on total pages */}
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

            {/* User Status Dropdown */}
            <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
                <Dropdown>
                    <Dropdown.Toggle variant="success">
                        {userStatus}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setUserStatus("User logged in")}>User logged in</Dropdown.Item>
                        <Dropdown.Item onClick={() => setUserStatus("Admin logged in")}>Admin logged in</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
            {/* Background images positioned in the top-right corner of the navbar */}

            <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">

        {/* Background image positioned in the top-right corner of the navbar */}
                    <div
                    style={{
                    position: 'absolute',  // Positioning it within the navbar
                    top: 0,
                    right: -5,
                    width: '310px',  // Set a small size for the background image
                    height: '350px',  // Set a small size for the background image
                    backgroundImage: `url(${backRightImage})`,  // Background image URL
                    backgroundSize: 'cover',  // Ensure the background image covers the div
                    backgroundRepeat: 'no-repeat',  // Prevent repeating the image
                    }}
                    />
                    <div
                    style={{
                    position: 'absolute',  // Positioning it within the navbar
                    top: 490,
                    right: -5,
                    width: '310px',  // Set a small size for the background image
                    height: '350px',  // Set a small size for the background image
                    backgroundImage: `url(${backgroundPeopleImage})`,  // Background image URL
                    backgroundSize: 'cover',  // Ensure the background image covers the div
                    backgroundRepeat: 'no-repeat',  // Prevent repeating the image
                    }}
                    />

                    <div
                    style={{
                    position: 'absolute',  // Positioning it within the navbar
                    top: 490,
                    right: 1100,
                    width: '400px',  // Set a small size for the background image
                    height: '350px',  // Set a small size for the background image
                    backgroundImage: `url(${backgroundIv})`,  // Background image URL
                    backgroundSize: 'cover',  // Ensure the background image covers the div
                    backgroundRepeat: 'no-repeat',  // Prevent repeating the image
                    }}
                    />

                    </Container>



        </div>

        
    );
}

export default OppListPage;
