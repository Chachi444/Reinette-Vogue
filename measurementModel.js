const mongoose = require("mongoose");


// Gown Measurement Schema
const gownMeasurementSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
   
    customerEmail: {
        type: String,
        required: true,
        lowercase: true
    },


    // Gown specific measurements (in inches or centimeters)
    shoulder: { type: Number },
    bust: { type: Number },
    bustPan: { type: Number },
    upperChest: { type: Number },
    bustPoint: { type: Number },
    underBust: { type: Number },
    halfLength: { type: Number },
    basque: { type: Number },
    waist: { type: Number },
    hipPoint: { type: Number },
    hips: { type: Number },
    armhole: { type: Number },
    sleeve: { type: Number },
    roundSleeve: { type: Number },
    back: { type: Number },
    knee: { type: Number },
    fullLength: { type: Number },


    // Measurement unit for reference
    measurementUnit: {
        type: String,
        enum: ['inches', 'centimeters'],
        default: 'inches'
    },


    // Additional info
    notes: {
        type: String,
        default: ""
    },
   
    measurementType: {
        type: String,
        default: "Gown"
    },


    orderStatus: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'delivered'],
        default: 'pending'
    },


    estimatedDelivery: {
        type: Date
    }


}, { timestamps: true });


// Trouser Measurement Schema
const trouserMeasurementSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
   
    customerEmail: {
        type: String,
        required: true,
        lowercase: true
    },


    // Trouser specific measurements (in inches or centimeters)
    waist: { type: Number },
    hips: { type: Number },
    crotch: { type: Number },
    laps: { type: Number },
    trouserLength: { type: Number },


    // Measurement unit for reference
    measurementUnit: {
        type: String,
        enum: ['inches', 'centimeters'],
        default: 'inches'
    },


    // Additional info
    notes: {
        type: String,
        default: ""
    },
   
    measurementType: {
        type: String,
        default: "Trouser"
    },


    orderStatus: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'delivered'],
        default: 'pending'
    },


    estimatedDelivery: {
        type: Date
    }


}, { timestamps: true });


// General Measurement Schema (for the basic endpoint you had)
const generalMeasurementSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
   
    customerEmail: {
        type: String,
        required: true,
        lowercase: true
    },


    // Basic measurements (in inches or centimeters)
    bust: { type: Number, required: true },
    waist: { type: Number, required: true },
    hips: { type: Number, required: true },
    height: { type: Number, required: true },


    // Measurement unit for reference
    measurementUnit: {
        type: String,
        enum: ['inches', 'centimeters'],
        default: 'inches'
    },


    // Additional info
    notes: {
        type: String,
        default: ""
    },
   
    measurementType: {
        type: String,
        default: "General"
    }


}, { timestamps: true });


// Create indexes for efficient queries
gownMeasurementSchema.index({ customerEmail: 1, createdAt: -1 });
trouserMeasurementSchema.index({ customerEmail: 1, createdAt: -1 });
generalMeasurementSchema.index({ customerEmail: 1, createdAt: -1 });


// Create models
const GownMeasurement = mongoose.model("GownMeasurement", gownMeasurementSchema);
const TrouserMeasurement = mongoose.model("TrouserMeasurement", trouserMeasurementSchema);
const GeneralMeasurement = mongoose.model("GeneralMeasurement", generalMeasurementSchema);


module.exports = {
    GownMeasurement,
    TrouserMeasurement,
    GeneralMeasurement
};



