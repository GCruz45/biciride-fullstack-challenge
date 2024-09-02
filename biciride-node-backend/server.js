const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bikeRoutes = require("./routes/bikes");
const Bike = require("./models/Bike");
const router = express.Router();

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected from MongoDB");
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", bikeRoutes);

// Create new bike
app.post("/api/bikes", async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  try {
    const { marca, tipo, color, estado } = req.body;
    const newBike = new Bike({
      marca,
      tipo,
      color,
      estado,
      location: { coordinates: [3.4516, -76.532] }, // Default location
    });
    await newBike.save();
    res.status(201).json(newBike);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar bicicleta" });
  }
});

// Update bike location
app.put("/api/bikes/:id", async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const { id } = req.params;
  const { latitude, longitude } = req.body;

  try {
    // Convert id to ObjectId
    const bike = await Bike.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: { "location.coordinates": [latitude, longitude] } },
      { new: true } // Return the updated bike
    );
    console.log("Bike location updated:", bike);
    if (!bike) {
      return res.status(404).send("Bike not found");
    }

    res.json(bike);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Update bike status
app.put("/api/bikes/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const bike = await Bike.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: { "estado.type": status } },
      { new: true } // Return the updated bike
    );

    if (!bike) {
      return res.status(404).send("Bike not found");
    }

    res.json(bike);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete a bike
app.delete("/api/bikes/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const bike = await Bike.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    console.log("Bike id before deleted:", id);
    if (!bike) {
      return res.status(404).send("Bike not found");
    }

    res.json({ message: "Bike deleted successfully" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// app.put("/bikes/status", bikeRoutes.updateBikeStatus); // New route for updating status

module.exports = router;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
