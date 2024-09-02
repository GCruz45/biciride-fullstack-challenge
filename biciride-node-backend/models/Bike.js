const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["Cross", "Mountain bike", "Ruta"],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  estado: {
    type: {
      type: String,
      enum: ["Disponible", "No disponible"],
      default: "Disponible",
    },
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [3.45, -76.53],
    },
  },
  arrendatario: { type: String, default: "" }, // New field to store user's email,
});

// bikeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Bike", bikeSchema);
