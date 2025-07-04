const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const { v2: cloudinary } = require('cloudinary');




const Appointment = require("./appointmentModel");
const { GownMeasurement, TrouserMeasurement, GeneralMeasurement } = require("./measurementModel");




dotenv.config();




const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const app = express();




app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 8080;




const MONGODB_URI = process.env.MONGODB_URL || "mongodb+srv://Reinette:q1JKts4IJZK4DCSR@cluster0.obcwh8r.mongodb.net/reinette-vogue?retryWrites=true&w=majority&appName=Cluster0";




async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully to Reinette-Vogue database");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
}


// MongoDB connection and server startup will be handled at the end




const storage = multer.memoryStorage();




const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});




const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'reinette-vogue/inspiration', // Organize images in folders
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };
   
    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });
};




app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to REINETTE VOGUE - Your Home of Fashion Elegance and Sophistication",
    status: "Server running successfully",
    timestamp: new Date().toISOString()
  });
});




app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});






app.post("/book-appointment", async (req, res) => {
  try {
    const { name, email, date, time, appointmentType, notes } = req.body;


   
    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: "Name, email, date, and time are required" });
    }


   
    const newAppointment = new Appointment({
      name,
      email,
      date: new Date(date),
      time,
      appointmentType: appointmentType || 'consultation',
      notes: notes || ""
    });


   
    const savedAppointment = await newAppointment.save();


    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      error: "Failed to book appointment",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


app.post("/body-measurement/gown", upload.array('inspirationImages', 5), async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      shoulder,
      bust,
      bustPan,
      upperChest,
      bustPoint,
      underBust,
      halfLength,
      basque,
      waist,
      hipPoint,
      hips,
      armhole,
      sleeve,
      roundSleeve,
      back,
      knee,
      fullLength,
      notes,
      estimatedDelivery,
      styleDescription,
      preferredColors,
      occasion
    } = req.body;

    // Basic validation
    if (!customerName || !customerEmail) {
      return res.status(400).json({
        error: "Customer name and email are required",
        timestamp: new Date().toISOString()
      });
    }

    // Handle image uploads
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} gown inspiration images to Cloudinary...`);
      
      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            public_id: `gown-inspiration-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
            folder: `reinette-vogue/gown-inspiration`
          });
          
          return {
            publicId: result.public_id,
            originalName: file.originalname,
            cloudinaryUrl: result.secure_url,
            optimizedUrl: cloudinary.url(result.public_id, {
              quality: 'auto',
              fetch_format: 'auto',
              width: 800,
              height: 600,
              crop: 'limit'
            }),
            size: file.size,
            format: result.format,
            width: result.width,
            height: result.height
          };
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw error;
        }
      });
      
      try {
        uploadedImages = await Promise.all(uploadPromises);
        console.log(`✅ Successfully uploaded ${uploadedImages.length} images to Cloudinary`);
      } catch (error) {
        console.error('Error uploading images:', error);
        return res.status(500).json({
          error: "Failed to upload images",
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Create new gown measurement with style inspiration
    const newGownMeasurement = new GownMeasurement({
      customerName,
      customerEmail,
      shoulder,
      bust,
      bustPan,
      upperChest,
      bustPoint,
      underBust,
      halfLength,
      basque,
      waist,
      hipPoint,
      hips,
      armhole,
      sleeve,
      roundSleeve,
      back,
      knee,
      fullLength,
      notes: notes || "",
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      styleInspiration: {
        images: uploadedImages,
        description: styleDescription || "",
        preferredColors: preferredColors || "",
        occasion: occasion || "",
        hasImages: uploadedImages.length > 0
      }
    });

    const savedMeasurement = await newGownMeasurement.save();

    res.status(201).json({
      message: "Gown measurements and style inspiration recorded successfully",
      measurement: savedMeasurement,
      imageCount: uploadedImages.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error saving gown measurements:", error);
    res.status(500).json({
      error: "Failed to save gown measurements",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


app.post("/body-measurement/trouser", upload.array('inspirationImages', 5), async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      waist,
      hips,
      crotch,
      laps,
      trouserLength,
      notes,
      estimatedDelivery,
      styleDescription,
      preferredColors,
      occasion
    } = req.body;

    // Basic validation
    if (!customerName || !customerEmail) {
      return res.status(400).json({
        error: "Customer name and email are required",
        timestamp: new Date().toISOString()
      });
    }

    // Handle image uploads
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} trouser inspiration images to Cloudinary...`);
      
      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            public_id: `trouser-inspiration-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
            folder: `reinette-vogue/trouser-inspiration`
          });
          
          return {
            publicId: result.public_id,
            originalName: file.originalname,
            cloudinaryUrl: result.secure_url,
            optimizedUrl: cloudinary.url(result.public_id, {
              quality: 'auto',
              fetch_format: 'auto',
              width: 800,
              height: 600,
              crop: 'limit'
            }),
            size: file.size,
            format: result.format,
            width: result.width,
            height: result.height
          };
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw error;
        }
      });
      
      try {
        uploadedImages = await Promise.all(uploadPromises);
        console.log(`✅ Successfully uploaded ${uploadedImages.length} images to Cloudinary`);
      } catch (error) {
        console.error('Error uploading images:', error);
        return res.status(500).json({
          error: "Failed to upload images",
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Create new trouser measurement with style inspiration
    const newTrouserMeasurement = new TrouserMeasurement({
      customerName,
      customerEmail,
      waist,
      hips,
      crotch,
      laps,
      trouserLength,
      notes: notes || "",
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      styleInspiration: {
        images: uploadedImages,
        description: styleDescription || "",
        preferredColors: preferredColors || "",
        occasion: occasion || "",
        hasImages: uploadedImages.length > 0
      }
    });

    const savedMeasurement = await newTrouserMeasurement.save();

    res.status(201).json({
      message: "Trouser measurements and style inspiration recorded successfully",
      measurement: savedMeasurement,
      imageCount: uploadedImages.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error saving trouser measurements:", error);
    res.status(500).json({
      error: "Failed to save trouser measurements",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});




app.post("/body-measurement", upload.array('inspirationImages', 5), async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      bust, 
      waist, 
      hips, 
      height, 
      notes,
      styleDescription,
      preferredColors,
      occasion
    } = req.body;

    // Basic validation
    if (!customerName || !customerEmail || !bust || !waist || !hips || !height) {
      return res.status(400).json({ error: "Customer name, email, bust, waist, hips, and height are required" });
    }

    // Handle image uploads
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} general inspiration images to Cloudinary...`);
      
      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            public_id: `general-inspiration-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
            folder: `reinette-vogue/general-inspiration`
          });
          
          return {
            publicId: result.public_id,
            originalName: file.originalname,
            cloudinaryUrl: result.secure_url,
            optimizedUrl: cloudinary.url(result.public_id, {
              quality: 'auto',
              fetch_format: 'auto',
              width: 800,
              height: 600,
              crop: 'limit'
            }),
            size: file.size,
            format: result.format,
            width: result.width,
            height: result.height
          };
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw error;
        }
      });
      
      try {
        uploadedImages = await Promise.all(uploadPromises);
        console.log(`✅ Successfully uploaded ${uploadedImages.length} images to Cloudinary`);
      } catch (error) {
        console.error('Error uploading images:', error);
        return res.status(500).json({
          error: "Failed to upload images",
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Create new general measurement with style inspiration
    const newGeneralMeasurement = new GeneralMeasurement({
      customerName,
      customerEmail,
      bust,
      waist,
      hips,
      height,
      notes: notes || "",
      styleInspiration: {
        images: uploadedImages,
        description: styleDescription || "",
        preferredColors: preferredColors || "",
        occasion: occasion || "",
        hasImages: uploadedImages.length > 0
      }
    });

    const savedMeasurement = await newGeneralMeasurement.save();

    res.status(201).json({
      message: "Body measurements and style inspiration recorded successfully",
      measurement: savedMeasurement,
      imageCount: uploadedImages.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error saving general measurements:", error);
    res.status(500).json({
      error: "Failed to save measurements",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET endpoints to retrieve data

// Get all appointments
app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Appointments retrieved successfully",
      count: appointments.length,
      appointments: appointments
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res.status(500).json({
      error: "Failed to retrieve appointments",
      details: error.message
    });
  }
});

// Get appointment by ID
app.get("/appointments/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment retrieved successfully",
      appointment: appointment
    });
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({
      error: "Failed to retrieve appointment",
      details: error.message
    });
  }
});

// Get all gown measurements
app.get("/gown-measurements", async (req, res) => {
  try {
    const measurements = await GownMeasurement.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Gown measurements retrieved successfully",
      count: measurements.length,
      measurements: measurements
    });
  } catch (error) {
    console.error("Error retrieving gown measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve gown measurements",
      details: error.message
    });
  }
});

// Get all trouser measurements
app.get("/trouser-measurements", async (req, res) => {
  try {
    const measurements = await TrouserMeasurement.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Trouser measurements retrieved successfully",
      count: measurements.length,
      measurements: measurements
    });
  } catch (error) {
    console.error("Error retrieving trouser measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve trouser measurements",
      details: error.message
    });
  }
});

// Get all general measurements
app.get("/general-measurements", async (req, res) => {
  try {
    const measurements = await GeneralMeasurement.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "General measurements retrieved successfully",
      count: measurements.length,
      measurements: measurements
    });
  } catch (error) {
    console.error("Error retrieving general measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve general measurements",
      details: error.message
    });
  }
});

// Get measurements by customer email
app.get("/measurements/customer/:email", async (req, res) => {
  try {
    const email = req.params.email;
    
    const [gownMeasurements, trouserMeasurements, generalMeasurements] = await Promise.all([
      GownMeasurement.find({ customerEmail: email }),
      TrouserMeasurement.find({ customerEmail: email }),
      GeneralMeasurement.find({ customerEmail: email })
    ]);

    res.status(200).json({
      message: "Customer measurements retrieved successfully",
      customerEmail: email,
      measurements: {
        gown: gownMeasurements,
        trouser: trouserMeasurements,
        general: generalMeasurements
      }
    });
  } catch (error) {
    console.error("Error retrieving customer measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve customer measurements",
      details: error.message
    });
  }
});

app.post("/upload-inspiration", upload.array('inspirationImages', 5), async (req, res) => {
  try {
    const { customerName, customerEmail, designType, description } = req.body;


    if (!customerName || !customerEmail || !designType) {
      return res.status(400).json({
        error: "Customer name, email, and design type are required",
        timestamp: new Date().toISOString()
      });
    }


   
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      // Upload images to Cloudinary
      console.log(`📸 Uploading ${req.files.length} images to Cloudinary...`);
     
      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            public_id: `${designType}-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
            folder: `reinette-vogue/${designType}-inspiration`
          });
         
          return {
            publicId: result.public_id,
            originalName: file.originalname,
            cloudinaryUrl: result.secure_url,
            size: file.size,
            format: result.format,
            width: result.width,
            height: result.height,
            optimizedUrl: cloudinary.url(result.public_id, {
              quality: 'auto',
              fetch_format: 'auto',
              width: 800,
              height: 600,
              crop: 'limit'
            })
          };
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw error;
        }
      });
     
      try {
        imagePaths = await Promise.all(uploadPromises);
        console.log(`✅ Successfully uploaded ${imagePaths.length} images to Cloudinary`);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({
          error: "Failed to upload images to cloud storage",
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }


   
    const inspirationData = {
      customerName,
      customerEmail,
      designType,
      description: description || "",
      images: imagePaths,
      hasImages: imagePaths.length > 0,
      submissionDate: new Date()
    };


   
    res.status(201).json({
      message: imagePaths.length > 0
        ? "Inspiration images and details uploaded successfully"
        : "Design requirements submitted successfully (no images)",
      inspiration: inspirationData,
      imageCount: imagePaths.length,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error("Error uploading inspiration:", error);
    res.status(500).json({
      error: "Failed to upload inspiration",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});




app.post("/design-request", async (req, res) => {
  try {
    const { customerName, customerEmail, designType, description, preferredColors, budget, occasion } = req.body;


    if (!customerName || !customerEmail || !designType || !description) {
      return res.status(400).json({
        error: "Customer name, email, design type, and description are required",
        timestamp: new Date().toISOString()
      });
    }


    const designRequest = {
      customerName,
      customerEmail,
      designType,
      description,
      preferredColors: preferredColors || "",
      budget: budget || "",
      occasion: occasion || "",
      submissionType: "text-only",
      submissionDate: new Date()
    };


   
    res.status(201).json({
      message: "Design request submitted successfully",
      designRequest,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error("Error submitting design request:", error);
    res.status(500).json({
      error: "Failed to submit design request",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});




app.get("/body-measurement/:email", async (req, res) => {
  try {
    const { email } = req.params;
   
    if (!email) {
      return res.status(400).json({
        error: "Email parameter is required",
        timestamp: new Date().toISOString()
      });
    }


    // Fetch all measurements for the customer
    const [gownMeasurements, trouserMeasurements, generalMeasurements] = await Promise.all([
      GownMeasurement.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 }),
      TrouserMeasurement.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 }),
      GeneralMeasurement.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 })
    ]);


    res.status(200).json({
      message: "Customer measurements retrieved successfully",
      customerEmail: email,
      measurements: {
        gowns: gownMeasurements,
        trousers: trouserMeasurements,
        general: generalMeasurements
      },
      totalRecords: gownMeasurements.length + trouserMeasurements.length + generalMeasurements.length,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error("Error fetching measurements:", error);
    res.status(500).json({
      error: "Failed to fetch measurements",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


// Get optimized image URL from Cloudinary
app.get("/image/:publicId", (req, res) => {
  try {
    const { publicId } = req.params;
    const { width, height, quality, format } = req.query;
   
    const transformations = {
      quality: quality || 'auto',
      fetch_format: format || 'auto'
    };
   
    if (width) transformations.width = parseInt(width);
    if (height) transformations.height = parseInt(height);
    if (width && height) transformations.crop = 'limit';
   
    const optimizedUrl = cloudinary.url(publicId, transformations);
   
    res.status(200).json({
      publicId,
      originalUrl: cloudinary.url(publicId),
      optimizedUrl,
      transformations,
      timestamp: new Date().toISOString()
    });
   
  } catch (error) {
    console.error("Error generating image URL:", error);
    res.status(500).json({
      error: "Failed to generate image URL",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


// Delete image from Cloudinary
app.delete("/image/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
   
    const result = await cloudinary.uploader.destroy(publicId);
   
    if (result.result === 'ok') {
      res.status(200).json({
        message: "Image deleted successfully",
        publicId,
        result,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({
        error: "Image not found or already deleted",
        publicId,
        result,
        timestamp: new Date().toISOString()
      });
    }
   
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      error: "Failed to delete image",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


// Payment Processing Endpoints


// STRIPE PAYMENT ENDPOINTS


// Create Stripe payment intent
app.post("/payment/stripe/create-intent", async (req, res) => {
  try {
    const {
      amount,
      currency = 'usd',
      customerEmail,
      customerName,
      orderType, // 'gown', 'trouser', 'consultation', etc.
      orderDetails
    } = req.body;


    if (!amount || !customerEmail || !customerName) {
      return res.status(400).json({
        error: "Amount, customer email, and name are required",
        timestamp: new Date().toISOString()
      });
    }


    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        customerEmail,
        customerName,
        orderType: orderType || 'fashion_order',
        orderDetails: JSON.stringify(orderDetails || {}),
        businessName: 'Reinette-Vogue'
      },
      receipt_email: customerEmail
    });


    res.status(200).json({
      message: "Stripe payment intent created successfully",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error("Stripe payment intent error:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


// Confirm Stripe payment
app.post("/payment/stripe/confirm", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;


    if (!paymentIntentId) {
      return res.status(400).json({
        error: "Payment intent ID is required",
        timestamp: new Date().toISOString()
      });
    }


    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);


    res.status(200).json({
      message: "Payment status retrieved",
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      customerEmail: paymentIntent.metadata.customerEmail,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error("Stripe payment confirmation error:", error);
    res.status(500).json({
      error: "Failed to confirm payment",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


// PAYSTACK PAYMENT ENDPOINTS


// Initialize Paystack transaction
app.post("/payment/paystack/initialize", async (req, res) => {
  try {
    const {
      amount,
      customerEmail,
      customerName,
      orderType,
      orderDetails,
      currency = 'NGN'
    } = req.body;


    if (!amount || !customerEmail || !customerName) {
      return res.status(400).json({
        error: "Amount, customer email, and name are required",
        timestamp: new Date().toISOString()
      });
    }


    const params = {
      email: customerEmail,
      amount: Math.round(amount * 100), // Convert to kobo (for NGN)
      currency: currency,
      metadata: {
        customerName,
        orderType: orderType || 'fashion_order',
        orderDetails: JSON.stringify(orderDetails || {}),
        businessName: 'Reinette-Vogue'
      }
    };


    // Make direct API call to Paystack
    const response = await axios.post(`${PAYSTACK_BASE_URL}/transaction/initialize`, params, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });


    if (response.data.status) {
      res.status(200).json({
        message: "Paystack payment initialized successfully",
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference,
        amount: amount,
        currency: currency,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: "Failed to initialize payment",
        details: response.data.message,
        timestamp: new Date().toISOString()
      });
    }


  } catch (error) {
    console.error("Paystack initialization error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to initialize payment",
      details: error.response?.data?.message || error.message,
      timestamp: new Date().toISOString()
    });
  }
});


// Verify Paystack transaction
app.post("/payment/paystack/verify", async (req, res) => {
  try {
    const { reference } = req.body;


    if (!reference) {
      return res.status(400).json({
        error: "Transaction reference is required",
        timestamp: new Date().toISOString()
      });
    }


    Paystack.transaction.verify(reference, (error, body) => {
      if (error) {
        console.error("Paystack verification error:", error);
        return res.status(500).json({
          error: "Failed to verify payment",
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }


      if (body.data.status === 'success') {
        res.status(200).json({
          message: "Payment verified successfully",
          status: body.data.status,
          amount: body.data.amount / 100,
          currency: body.data.currency,
          customerEmail: body.data.customer.email,
          reference: body.data.reference,
          paidAt: body.data.paid_at,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          message: "Payment verification failed",
          status: body.data.status,
          reference: reference,
          timestamp: new Date().toISOString()
        });
      }
    });


  } catch (error) {
    console.error("Paystack verification error:", error);
    res.status(500).json({
      error: "Failed to verify payment",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


// WEBHOOK ENDPOINTS


// Stripe webhook (for development - webhook secret not required)
app.post("/webhook/stripe", express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;


  // Check if webhook secret is configured
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Stripe webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // For development - parse webhook payload without verification
    console.log('⚠️ Webhook secret not configured - running in development mode');
    try {
      event = JSON.parse(req.body);
    } catch (err) {
      console.error('Failed to parse webhook payload:', err.message);
      return res.status(400).send('Invalid JSON payload');
    }
  }


  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ Payment succeeded:', paymentIntent.id);
      // Here you would update your database, send confirmation email, etc.
      break;
   
    case 'payment_intent.payment_failed':
      const paymentFailure = event.data.object;
      console.log('❌ Payment failed:', paymentFailure.id);
      // Handle failed payment
      break;
   
    default:
      console.log(`Unhandled event type ${event.type}`);
  }


  res.json({received: true, mode: process.env.STRIPE_WEBHOOK_SECRET ? 'production' : 'development'});
});


// Paystack webhook
app.post("/webhook/paystack", (req, res) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
 
  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;
   
    switch (event.event) {
      case 'charge.success':
        console.log('✅ Paystack payment succeeded:', event.data.reference);
        // Handle successful payment
        break;
     
      case 'charge.failed':
        console.log('❌ Paystack payment failed:', event.data.reference);
        // Handle failed payment
        break;
     
      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }
  }
 
  res.status(200).end();
});


// PAYMENT UTILITY ENDPOINTS


// Get supported currencies
app.get("/payment/currencies", (req, res) => {
  res.status(200).json({
    stripe: {
      supported: ['usd', 'eur', 'gbp', 'cad', 'aud'],
      default: 'usd'
    },
    paystack: {
      supported: ['NGN', 'USD', 'GHS', 'ZAR', 'KES'],
      default: 'NGN'
    },
    timestamp: new Date().toISOString()
  });
});


// Calculate conversion rates (basic example)
app.get("/payment/exchange-rate/:from/:to", async (req, res) => {
  try {
    const { from, to } = req.params;
   
    // In production, you'd use a real exchange rate API
    const basicRates = {
      'USD': { 'NGN': 750, 'GHS': 12, 'ZAR': 18 },
      'NGN': { 'USD': 0.0013, 'GHS': 0.016, 'ZAR': 0.024 }
    };
   
    const rate = basicRates[from.toUpperCase()]?.[to.toUpperCase()] || 1;
   
    res.status(200).json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      rate: rate,
      note: "Basic conversion - use real exchange rate API in production",
      timestamp: new Date().toISOString()
    });
   
  } catch (error) {
    res.status(500).json({
      error: "Failed to get exchange rate",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});


// GET endpoints to retrieve data

// Get all appointments
app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Appointments retrieved successfully",
      count: appointments.length,
      appointments: appointments
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res.status(500).json({
      error: "Failed to retrieve appointments",
      details: error.message
    });
  }
});

// Get appointment by ID
app.get("/appointments/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment retrieved successfully",
      appointment: appointment
    });
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({
      error: "Failed to retrieve appointment",
      details: error.message
    });
  }
});

// Get all gown measurements
app.get("/gown-measurements", async (req, res) => {
  try {
    const measurements = await GownMeasurement.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Gown measurements retrieved successfully",
      count: measurements.length,
      measurements: measurements
    });
  } catch (error) {
    console.error("Error retrieving gown measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve gown measurements",
      details: error.message
    });
  }
});

// Get all trouser measurements
app.get("/trouser-measurements", async (req, res) => {
  try {
    const measurements = await TrouserMeasurement.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Trouser measurements retrieved successfully",
      count: measurements.length,
      measurements: measurements
    });
  } catch (error) {
    console.error("Error retrieving trouser measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve trouser measurements",
      details: error.message
    });
  }
});

// Get all general measurements
app.get("/general-measurements", async (req, res) => {
  try {
    const measurements = await GeneralMeasurement.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "General measurements retrieved successfully",
      count: measurements.length,
      measurements: measurements
    });
  } catch (error) {
    console.error("Error retrieving general measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve general measurements",
      details: error.message
    });
  }
});

// Get measurements by customer email
app.get("/measurements/customer/:email", async (req, res) => {
  try {
    const email = req.params.email;
    
    const [gownMeasurements, trouserMeasurements, generalMeasurements] = await Promise.all([
      GownMeasurement.find({ customerEmail: email }),
      TrouserMeasurement.find({ customerEmail: email }),
      GeneralMeasurement.find({ customerEmail: email })
    ]);

    res.status(200).json({
      message: "Customer measurements retrieved successfully",
      customerEmail: email,
      measurements: {
        gown: gownMeasurements,
        trouser: trouserMeasurements,
        general: generalMeasurements
      }
    });
  } catch (error) {
    console.error("Error retrieving customer measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve customer measurements",
      details: error.message
    });
  }
});

// Start the server with proper MongoDB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Reinette-Vogue Server running on port ${PORT}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
  });
});