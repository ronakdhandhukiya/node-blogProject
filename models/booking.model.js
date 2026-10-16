const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceName: { type: String, required: true, trim: true },
  requestedDate: { type: Date, required: true },
  status: {type: String, enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending"
  }
}, 
{
  timestamps: true
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking