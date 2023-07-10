import { db } from "../db.js";
import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: "../client/public/uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = uniqueSuffix + fileExtension;
    cb(null, fileName);
    req.body.featuredImage = fileName;
    req.body.kitchenIamgeImage = fileName; 
  },
});

// Multer upload instance for featured image
const uploadFeaturedImage = multer({ storage }).single("featuredImage");
const uploadKitchenImage = multer({ storage }).single("kitchenImage");

// POST PROPERTY INFORMATION TO DATABASE
export const propertyInformation = (req, res) => {
  // Handle featured image upload
  uploadFeaturedImage(req, res, (err) => {
    if (err) {
      console.error("Error uploading featured image:", err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    uploadKitchenImage(req, res, (err) => {
      if (err) {
        console.error("Error uploading featured image:", err);
        res.status(500).json({ error: "An error occurred" });
        return;
      }

      // Extract the form data from the request body
      const {
        buildingType,
        propertyName,
        rentOrSale,
        numOfHall,
        numOfKitchen,
        numOfBedroom,
        numOfStore,
        numOfCarsInGarage,
        numOfBeds,
        numOfCushions,
        numOfCupboards,
        numOfDining,
        numOfLivingRoom,
        numOfPalorReception,
        numOfBathroom,
        street,
        condition_,
        electricity,
        seller,
        city,
        inspection,
        aunctionRegistered,
        state,
        propertyPrice,
        facebookLink,
        instagramLink,
        twitterLink,
        websiteLink,
        propertyDesc,
        fullName,
        email,
        phoneNumber,
        accountNumber,
        featuredImage,
        kitchenImage,
      } = req.body;

      // Get the current date and time
      const listedDate = new Date();

      // Construct the SQL query
      const sql = `INSERT INTO property_information (buildingType, propertyName, rentOrSale, numOfHall, numOfKitchen, numOfBedroom, numOfStore, numOfCarsInGarage,  numOfBeds, numOfCushions, numOfCupboards, numOfDining, numOfLivingRoom, numOfPalorReception, numOfBathroom, street, condition_, electricity, seller, city, inspection, aunctionRegistered, state, propertyPrice, featuredImage, kitchenImage facebookLink, instagramLink, twitterLink, websiteLink, propertyDesc, fullName, email, phoneNumber, accountNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      // Execute the query with the form data and image name as parameters
      db.query(
        sql,
        [
          buildingType,
          propertyName,
          listedDate, // Pass the current date to the query
          rentOrSale,
          numOfHall,
          numOfKitchen,
          numOfBedroom,
          numOfStore,
          numOfCarsInGarage,
          numOfBeds,
          numOfCushions,
          numOfCupboards,
          numOfDining,
          numOfLivingRoom,
          numOfPalorReception,
          numOfBathroom,
          street,
          condition_,
          electricity,
          seller,
          city,
          inspection,
          aunctionRegistered,
          state,
          propertyPrice,
          featuredImage,
          kitchenImage,
          facebookLink,
          instagramLink,
          twitterLink,
          websiteLink,
          propertyDesc,
          fullName,
          email,
          phoneNumber,
          accountNumber,
        ],
        (err, result) => {
          if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).json({ error: "An error occurred" });
            return;
          }

          console.log("Data saved to the database");
          res.status(200).json({ message: "Data saved successfully" });
        }
      );
    });
  });
};
