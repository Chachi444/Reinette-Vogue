const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const { v2: cloudinary } = require("cloudinary");
const Appointment = require("./Models/appointmentModel");
const { GownMeasurement, TrouserMeasurement, GeneralMeasurement} = require("./Models/measurementModel");

// Import routes
const routes = require("./Routes");

// Import controllers


dotenv.config();

// console.log("URL from env:", process.env.MONGODB_URL);

// Initialize payment gateways only if API keys are provided
// // let stripe;
// // let Paystack;
// // let PAYSTACK_BASE_URL = "https://api.paystack.co";
// // let PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// try {
//   if (process.env.STRIPE_SECRET_KEY) {
//     stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//   }
//   if (process.env.PAYSTACK_SECRET_KEY) {
//     Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);
//   }
// } catch (error) {
//   console.log("⚠️ Payment gateways not initialized - install stripe and paystack packages if needed");
//}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

// MongoDB connection with retry logic and better error handling
const connectToMongoDB = async (retryCount = 0) => {
  const maxRetries = 3;
  
  if (!process.env.MONGODB_URL) {
    console.warn("⚠️ MONGODB_URL not found in environment variables");
    console.log("🚀 Starting server without database connection...");
    startServer();
    return;
  }

  try {
    console.log(`🔄 Attempting to connect to MongoDB... (Attempt ${retryCount + 1}/${maxRetries + 1})`);
    
    // Improved connection options with longer timeouts
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      heartbeatFrequencyMS: 10000, // 10 seconds heartbeat
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverApi: '1' // Use Stable API
    });
    
    console.log("✅ MongoDB connected successfully");
    
    // Add connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    startServer();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying connection in 5 seconds... (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => connectToMongoDB(retryCount + 1), 5000);
    } else {
      console.error("💡 Possible solutions:");
      console.error("   1. Check your MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)");
      console.error("   2. Verify your MONGODB_URL environment variable");
      console.error("   3. Ensure your MongoDB cluster is running and accessible");
      console.error("   4. Check your network connection and firewall settings");
      console.error("⚠️ Starting server without database connection...");
      startServer();
    }
  }
};

// Start MongoDB connection
connectToMongoDB();

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Reinette-Vogue Server running on port ${PORT}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🗄️ Database: ${mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
  });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "reinette-vogue/inspiration", // Organize images in folders
      quality: "auto",
      fetch_format: "auto",
      ...options,
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
};

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to REINETTE VOGUE - Your Home of Fashion Elegance and Sophistication",
    status: "Server running successfully",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use(routes);