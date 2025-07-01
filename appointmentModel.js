const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  appointmentType: {
    type: String,
    enum: ['consultation', 'fitting', 'pickup', 'design_discussion', 'measurement'],
    default: 'consultation'
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});


const Appointment = mongoose.model("Appointment", appointmentSchema);


module.exports = Appointment;



