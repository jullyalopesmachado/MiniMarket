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
    const itemsPerPage = 10;
    // React Router hook for navigation (not currently used in this component)
    const navigate = useNavigate();
    // State to manage user status in the dropdown menu
    const [userStatus, setUserStatus] = useState("User logged in");

    const  [searchTitle, setSearchTitle] = useState("");
    const [searchType, setSearchType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [loading, setLoading] = useState(true); // State to manage loading status

    // Fetch opportunities from an API when the component mounts or when the current page or search parameters change
        const fetchOpportunities = async () => {
            setLoading(true); // Set loading to true while fetching data
            try {
// Base API URL
const baseUrl = `${import.meta.env.VITE_API_URL}/api/opportunities/view`;

// Dynamically build query parameters
const params = new URLSearchParams({
    page: currentPage,
    limit: itemsPerPage,
});

        // Add search parameters only if they are defined
            if (searchTitle) params.append("title", searchTitle);
            if (searchType) params.append("type", searchType);
            if (searchLocation) params.append("location", searchLocation);

        // Construct the full API URL
                const apiUrl = `${baseUrl}?${params.toString()}`;
                console.log("API URL:", apiUrl); // Log the API URL for debugging
        // Fetch data from the API
                const response = await fetch(apiUrl);
                const data = await response.json();

            if (data.success) {
                console.log("Fetched opportunities:", data.opportunities); // Log fetched opportunities for debugging
                setOpportunities(data.opportunities || []); // Store the fetched data in state
                
            } else {
                console.error("Failed to fetch opportunities:", data.message);
                setOpportunities([]); // Set opportunities to an empty array if fetch fails
            }
            } catch (error) {
                console.error("Error fetching opportunities:", error);
                setOpportunities([]); // Set opportunities to an empty array if fetch fails
                
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        useEffect(() => {
        fetchOpportunities();
    }, [currentPage, searchTitle, searchType, searchLocation]); // Re-fetch data when currentPage or search parameters change

    const deleteOpportunity = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/opportunities/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                alert("Opportunity deleted successfully!");
                fetchOpportunities(); // Re-fetch opportunities after deletion
            } else {
                alert("Failed to delete opportunity:", data.message);
                console.error("Failed to delete opportunity:", data.message);
            }
        } catch (error) {
            console.error("Error deleting opportunity:", error);
            
        }
    }
    // Handle page change when a user clicks a pagination button
    const totalPages = Math.ceil(opportunities.length / itemsPerPage); // Calculate total pages based on opportunities length and items per page
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
                                    <Button variant="outline-success" className="ms-4" onClick={() => navigate("/user-profile")}>Profile</Button>
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
                {loading ? (
                    <p>Loading opportunities...</p>
                ) : 
                    opportunities && opportunities.length > 0 ? (
                    opportunities.map((opportunity) => (
                        <Col key={opportunity._id} md={6} className="mb-4">
                            <Card className="text-center">
                                {/* Opportunity Type */}
                    <Card.Header>{opportunity.type ? opportunity.type.toUpperCase() : "N/A"}</Card.Header>
                    <Card.Body>
                        {/* Title and Description */}
                        <Card.Title>{opportunity.title || "No Title Available"}</Card.Title>
                        <Card.Text>{opportunity.description || "No Description Available"}</Card.Text>
                        {/* Button to view details */}
                        <Button
                            variant="outline-success"
                            onClick={() => navigate(`/opportunity/${opportunity._id}`)} // Navigate to OpportunityDetailPage
                        >
                            View Details
                        </Button>
                    </Card.Body>
                    {/* Footer with posted by information */}
                    <Card.Footer className="text-muted">
                        Posted by {opportunity.posted_by || "Unknown"} on{" "}
                        {opportunity.createdAt
                            ? new Date(opportunity.createdAt).toLocaleDateString()
                            : "Unknown Date"}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))): (
                    <p>No opportunities found.</p>
                    )}
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
