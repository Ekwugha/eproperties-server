import { db } from "../db.js";

// GET ALL PROPERTY INFORMATION FROM DATABASE
export const getAllPropertyInformation = (req, res) => {
  // Construct the SQL query to select all property information
  const sql = `SELECT * FROM property_information`;

  // Execute the query
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    // Check if property information is found
    if (result.length === 0) {
      res.status(404).json({ error: "No property found" });
      return;
    }

    // Return the property information
    const properties = result;
    res.status(200).json({ properties });
  });
};

// GET PROPERTY INFORMATION BY ID FROM DATABASE
export const getPropertyInformationById = (req, res) => {
  const id = req.params.id; // Retrieve the property ID from the request parameters

  // Construct the SQL query to select the property information by ID
  const sql = `SELECT * FROM property_information WHERE id = ?`;

  // Execute the query with the property ID as a parameter
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    // Check if property information is found
    if (result.length === 0) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    // Return the property information
    const property = result[0];
    res.status(200).json({ property });
  });
};
