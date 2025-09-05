const express = require("express");
const router = express.Router();
const { addVehicle, getAvailableVehicles } = require("../controllers/vehicleController");

router.post("/", addVehicle);
router.get("/available", getAvailableVehicles);

module.exports = router;
