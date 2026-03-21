import express from "express";
import { addFood, searchFood } from "../controller/foodController.js";

const router = express.Router();

/* Add Food */
router.post("/food", addFood);

/* Search Food */
router.get("/food/search", searchFood);

export default router;