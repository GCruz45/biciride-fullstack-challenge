const mongoose = require("mongoose");
const express = require("express");
const Bike = require("../models/Bike");
const router = express.Router();

// Get all bikes
router.get("/bikes", async (req, res) => {
  try {
    const bikes = await Bike.find({});
    res.json(bikes);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get bike by ID. Example for id #5: curl -X GET "http://localhost:5000/api/bikes/5"
router.get("/bikes/:id", async (req, res) => {
  console.log("Request params:", req.params); // Log the request body
  const { id } = req.params;

  // Check if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid Bike ID:", id); // Log invalid ID
    return res.status(400).send("Invalid Bike ID");
  }

  try {
    console.log("Searching bike...");
    const bike = await Bike.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (bike) {
      console.log("Bike found:", bike); // Log the request body
      res.json(bike);
    } else {
      res.status(404).send("Bike not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a new bike
router.post("/api/bikes", async (req, res) => {
  try {
    const { marca, tipo, color, estado, location } = req.body;
    const newBike = new Bike({ marca, tipo, color, estado, location });
    await newBike.save();
    res.status(201).json(newBike);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update bike status and "Arriendatario"
exports.updateBikeStatus = async (req, res) => {
  const { id, newStatus, email } = req.body;

  try {
    const updateData = {
      estado: newStatus,
    };

    // Set or clear "Arriendatario" based on status
    if (newStatus === "No disponible") {
      updateData.arrendatario = email; // Set the user's email
    } else if (newStatus === "Disponible") {
      updateData.arrendatario = ""; // Clear the email
    }

    const updatedBike = await Bike.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json(updatedBike);
  } catch (error) {
    res.status(500).send("Error updating bike status.");
  }
};

module.exports = router;
