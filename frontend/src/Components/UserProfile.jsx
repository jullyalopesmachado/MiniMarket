// Importing React and useState hook for managing component state
import React, { useState } from "react";

// Importing an avatar image for the user profile
import avatarImage from "../Assets/dummyPic.png"; 
import logoImage from "../Assets/Logo3.png"; 
import { Link } from "react-router-dom";
// Importing Bootstrap styles for UI components
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserProfile.css";
import Axios from "axios";
import { useEffect } from "react";
import { updateData } from "../App";

// Importing Bootstrap components (Note: Fixed typo in 'bootstrap' and 'Breadcrumb')
import { Container, Row, Col, Button, Alert, Breadcrumb, Card, Form, Nav, Navbar, NavDropdown, NavbarCollapse, Spinner } from 'react-bootstrap';

import { useNavigate } from "react-router-dom"; 


export function UserProfile() {

  
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Layne");
  const [lastName, setLastName] = useState("Staley");
  const [userBio, setUserBio] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userWebsite, setUserWebsite] = useState(null);
  

  const [isLoading, setIsLoading] = useState(false); // tracks loading
  const [error, setError] = useState(null); // tracks error

  
  //const [userlogo, setUserLogo] = useState(avatarImage);
  const [userId, setUserId] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const profile = await response.json();

        console.log("User Profile:", profile);

        // Split user.name into firstName and lastName
        const [firstName, lastName] = (profile.name || "").split(" ");
        setFirstName(firstName || "");
        setLastName(lastName || "");

        // Set other profile data
        setUserId(profile._id);
        setUserBio(profile.bio || "");
        setUserLocation(profile.location || "");
        setUserWebsite(profile.website || "");
      } else {
        console.error("Error fetching user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  // Function to handle the form submission
  const handleSave = async () => {
if (!firstName || !lastName ) {
  setError("Required information missing");
  return;
}

    setIsLoading(true); // Set loading state to true
    setError(null); // Reset error state

    //prepare data to be saved 

    const updatedProfile = {
      _id: userId,
      firstName,
      lastName,
      //email,
      //businessName,
      bio: userBio,
      location: userLocation,
      website: userWebsite,
      //logo: userlogo,
    };

    try{
      // Updates data on the server
      const updatedUser = await updateData(updatedProfile);
      console.log("User Profile Updated:", updatedUser);
      setIsEditing(false); // Set editing state to false
    } catch (err) {
    
      console.error("error updating profile", err);
      setError("Failed to update profile");

    } finally {
      setIsLoading(false); // Set loading state to false
    }

  };

  if (isLoading) {
    return <Spinner animation="border" />;
  }
    // log out handler
    const handleLogout = () => {
      //remove token from local storage
      localStorage.removeItem("token");
      // now redirect user to the login page
      navigate("/login-signup");  
  }

  return (
<div className="min-vh-100 w-100" >
    <Navbar expand="lg" className="img-fluid">
      <Container>
        <Card.Img variant="top" src={logoImage}  className="me-auto img-fluid" style={{width:'10%'}} />
        <Navbar.Toggle aria-controls="basic-navbar" className="me-auto" />
        <Navbar.Collapse id="basic-navbar-nav" className="me-auto img-fluid">
          <Nav className="ms-auto">

            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={handleClick}>Home Page</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Companies
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Feed</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    {/* User Profile Card */}

    <Container className="d-flex justify-content-center align-items-center mt-4 min-vh-100">

      <Card style={{ width: '28rem', paddingTop: '5rem' ,  background: 'linear-gradient(rgba(199, 200, 216, 0.9), rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.9)' }}>
        <div  className="d-flex justify-content-center align-items-center">
        <Card.Img variant="top" src={avatarImage}/* will be pulled from database*/  className="rounded-circle img-fluid h-50 w-50" />
        </div>
          <Card.Body>
            {/* Display user's first and last name */}
            <Card.Title>{firstName} {lastName}</Card.Title>
              {/* Display user's bio */}
              <Card.Text>
                {userBio || "No bio provided"}
              </Card.Text>

              {/* Display user's location */} 

            <Card.Text>
              <strong>Located in:</strong> {userLocation || "No location provided"}
            </Card.Text>

            {/* Display user's website */}
            <Card.Text>
              <strong>Find {firstName} at: </strong>
              {userWebsite || "No website provided"}
            </Card.Text>
            {/* User Profile Edit Button */}
            <div className="d-flex justify-content-center align-items-center"> 
            <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

 


   {/* User Profile Edit */}
    {isEditing && ( // form is only visible when isEditing is true
      <Container className="mt-3">
           {/* Form for editing */}
           <Form>
               {/* input field for editing first name */}
               <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text" // input type is text
                    value={firstName} // value is set to firstName. See up there as I set vals. 
                    onChange={(e) => setFirstName(e.target.value)} // onChange event handler to update firstName. / When user types, update `firstName` state
                    />
                  </Form.Group>

                {/* input field for editing last name */}
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text" // input type is text
                    value={lastName} // value is set to lastName
                    onChange={(e) => setLastName(e.target.value)} // onChange event handler to update lastName
                  />
                </Form.Group>

                {/* input field for editing bio */}
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea" // input type is textarea
                    value={userBio} // value is set to userBio which I set up there in the beginning of the code
                    onChange={(e) => setUserBio(e.target.value)} // onChange event handler to update userBio. When user types, update `userBio` state
                    />
                  </Form.Group>
                  {/* input field for editing location */}
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text" // input is text
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      />
                  </Form.Group>
                  
                  {/* input field for editing website */} 
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      value={userWebsite}
                      onChange={(e) => setUserWebsite(e.target.value)} // onChange event handler to update userWebsite. When user types, update `userWebsite` state
                    />
                  </Form.Group>

                  {/* Save button */}
                  <Button variant="success" onClick={handleSave} disabled={isLoading}>  {/* The button is disabled while the profile is being saved (i.e., when `isLoading` is true) */}

                    {isLoading ? "Saving..." : "Save Changes"} {/* If `isLoading` is true, show "Saving..." text; otherwise, show "Save Changes" */}
                  </Button>

                  {/* Display an error message if there was an issue during the save */}
                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Form>
      </Container>
    )}
      </div>
  
  );
}


export default UserProfile;




