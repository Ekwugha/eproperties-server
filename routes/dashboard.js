import express from "express";
import {
  propertyInformation,
} from "../controllers/dashboard.js";

const router = express.Router();

router.post("/property-information", propertyInformation);


export default router;
