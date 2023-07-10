import express from "express";
import {
  getAllPropertyInformation,
  getPropertyInformationById,
} from "../controllers/properties.js";

const router = express.Router();

router.get("/propertyInformation", getAllPropertyInformation);
router.get("/:id", getPropertyInformationById);

export default router;
