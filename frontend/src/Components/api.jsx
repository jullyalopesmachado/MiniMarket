export const fetchData = async ({ value, action }) => {

  let actionUrl = "";
  if (action === "search") {
    if (!value.trim()) return; // Prevent empty search requests

    actionUrl = `users?search=${encodeURIComponent(value)}`;

  } else if (action === "profile") {
    actionUrl = `profile`; // Fetch user profile

  } else if (action === "business") {
    actionUrl = `business`; 
  }

  
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/${actionUrl}`;
    console.log("Fetching from:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      console.log("API Response:", json);
      return json;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
      
    };

  export const sendData = async ( data, action ) => {
    let actionUrl = "";
    if (action === "Sign Up") {
      actionUrl = "users/register";
      data = { name: data.name, email: data.email, businessName: data.businessName, password: data.password };
    }
    else if (action === "Login") {
      actionUrl = "login";
      data = { email: data.email, password: data.password };
    }

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/${actionUrl}`;
  
  try {  
    console.log(data)
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Server error details:", errorDetails);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response;

  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};

  export const updateData = async (updatedProfile) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/users/${updatedProfile._id}`;

  try {  
    console.log("updated user data:", updatedProfile)
    const token = localStorage.getItem("token");
  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedProfile),
  });

  if (response.status === 200) {
  return response.data;
  } else {
    throw new Error("Error updating user data");
  }
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
  };

  export const fetchCompany = async () => {

    const token = localStorage.getItem("token");
    console.log("Token:", token); // Check if token is available
    if (!token) return null;

    try {
      const response = await fetch("http://localhost:3000/api/business/owned", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error fetching company");

      const userCompany = await response.json();
    

      if (userCompany) {
        localStorage.setItem("businessId", userCompany._id);
        localStorage.setItem("businessName", userCompany.name); // optional for display
        return userCompany;
      }        

      return null; // No company found
    } catch (err) {
      console.error("Failed to fetch company:", err);
      return null; // Handle error gracefully
    } 
  };