const Appointment = require("../Models/appointmentModel");
const { GownMeasurement, TrouserMeasurement, GeneralMeasurement } = require("../Models/measurementModel");
const Admin = require("../Models/adminModel"); 

// Controllers/Index.js - Reinette-Vogue Fashion Business Controllers
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { v2: cloudinary } = require("cloudinary");

// Helper function for uploading to Cloudinary
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


const handleBookAppointment = async (req, res) => {
  try {
    // Check database connection
    if (!require('mongoose').connection.readyState) {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable. Please try again later.",
        timestamp: new Date().toISOString()
      });
    }

    const { name, email, date, time, appointmentType, notes, phone } = req.body;

    // Validation
    if (!name || typeof name !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or missing name" 
      });
    }
    if (!email || typeof email !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or missing email" 
      });
    }
    if (!date || typeof date !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or missing date" 
      });
    }
    if (!time || typeof time !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or missing time" 
      });
    }

    // Check if appointment slot already exists
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      time: time
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        success: false,
        message: "Time slot already booked. Please choose another time." 
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      date: new Date(date),
      time,
      appointmentType: appointmentType || "consultation",
      notes: notes || "",
      status: "pending"
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, appointmentType } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (appointmentType) filter.appointmentType = appointmentType;

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      appointments: appointments,
      count: appointments.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving appointments",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment retrieved successfully",
      appointment: appointment,
    });
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({
      error: "Failed to retrieve appointment",
      details: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    // Validation
    if (!appointmentId || typeof appointmentId !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or missing appointment ID" 
      });
    }
    if (!status || typeof status !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or missing status" 
      });
    }

    // Valid statuses
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", ") 
      });
    }

    // Find and update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        status, 
        notes: notes || appointment.notes,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating appointment status",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};



const handleGownMeasurement = async (req, res) => {
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
      occasion,
    } = req.body;

    // Validation
    if (!customerName || typeof customerName !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or missing customer name" 
      });
    }
    if (!customerEmail || typeof customerEmail !== "string") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or missing customer email" 
      });
    }

    // Handle image uploads (if middleware processed them)
    let uploadedImages = [];
    if (req.uploadedImages) {
      uploadedImages = req.uploadedImages;
    }

    // Create new gown measurement
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
        hasImages: uploadedImages.length > 0,
      },
    });

    await newGownMeasurement.save();

    res.status(201).json({
      success: true,
      message: "Gown measurements recorded successfully",
      measurement: newGownMeasurement,
      imageCount: uploadedImages.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving gown measurements",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getAllGownMeasurements = async (req, res) => {
  try {
    const { page = 1, limit = 10, customerEmail } = req.query;
    
    const filter = customerEmail ? { customerEmail } : {};
    
    const measurements = await GownMeasurement.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GownMeasurement.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Gown measurements retrieved successfully",
      measurements: measurements,
      count: measurements.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving gown measurements",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getAllTrouserMeasurements = async (req, res) => {
  try {
    const { page = 1, limit = 10, customerEmail } = req.query;
    
    const filter = customerEmail ? { customerEmail } : {};
    
    const measurements = await TrouserMeasurement.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TrouserMeasurement.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Trouser measurements retrieved successfully",
      measurements: measurements,
      count: measurements.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving trouser measurements",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getAllGeneralMeasurements = async (req, res) => {
  try {
    const { page = 1, limit = 10, customerEmail } = req.query;
    
    const filter = customerEmail ? { customerEmail } : {};
    
    const measurements = await GeneralMeasurement.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GeneralMeasurement.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "General measurements retrieved successfully",
      measurements: measurements,
      count: measurements.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving general measurements",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getCustomerMeasurements = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
        timestamp: new Date().toISOString()
      });
    }

    const [gownMeasurements, trouserMeasurements, generalMeasurements] = await Promise.all([
      GownMeasurement.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 }),
      TrouserMeasurement.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 }),
      GeneralMeasurement.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      success: true,
      message: "Customer measurements retrieved successfully",
      customerEmail: email,
      measurements: {
        gown: gownMeasurements,
        trouser: trouserMeasurements,
        general: generalMeasurements
      },
      totalRecords: gownMeasurements.length + trouserMeasurements.length + generalMeasurements.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving customer measurements",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const handleTrouserMeasurement = async (req, res) => {
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
        occasion,
      } = req.body;

      // Basic validation
      if (!customerName || !customerEmail) {
        return res.status(400).json({
          error: "Customer name and email are required",
          timestamp: new Date().toISOString(),
        });
      }

      // Handle image uploads
      let uploadedImages = [];
      if (req.files && req.files.length > 0) {
        console.log(
          `📸 Uploading ${req.files.length} trouser inspiration images to Cloudinary...`
        );

        const uploadPromises = req.files.map(async (file) => {
          try {
            const result = await uploadToCloudinary(file.buffer, {
              public_id: `trouser-inspiration-${Date.now()}-${Math.round(
                Math.random() * 1e9
              )}`,
              folder: `reinette-vogue/trouser-inspiration`,
            });

            return {
              publicId: result.public_id,
              originalName: file.originalname,
              cloudinaryUrl: result.secure_url,
              optimizedUrl: cloudinary.url(result.public_id, {
                quality: "auto",
                fetch_format: "auto",
                width: 800,
                height: 600,
                crop: "limit",
              }),
              size: file.size,
              format: result.format,
              width: result.width,
              height: result.height,
            };
          } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
          }
        });

        try {
          uploadedImages = await Promise.all(uploadPromises);
          console.log(
            `✅ Successfully uploaded ${uploadedImages.length} images to Cloudinary`
          );
        } catch (error) {
          console.error("Error uploading images:", error);
          return res.status(500).json({
            error: "Failed to upload images",
            details: error.message,
            timestamp: new Date().toISOString(),
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
        estimatedDelivery: estimatedDelivery
          ? new Date(estimatedDelivery)
          : null,
        styleInspiration: {
          images: uploadedImages,
          description: styleDescription || "",
          preferredColors: preferredColors || "",
          occasion: occasion || "",
          hasImages: uploadedImages.length > 0,
        },
      });

      const savedMeasurement = await newTrouserMeasurement.save();

      res.status(201).json({
        message:
          "Trouser measurements and style inspiration recorded successfully",
        measurement: savedMeasurement,
        imageCount: uploadedImages.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving trouser measurements:", error);
      res.status(500).json({
        error: "Failed to save trouser measurements",
        details: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

const handleGeneralMeasurement = async (req, res) => {
  try {
    const measurements = await GeneralMeasurement.find().sort({
      createdAt: -1,
    });
    res.status(200).json({
      message: "General measurements retrieved successfully",
      count: measurements.length,
      measurements: measurements,
    });
  } catch (error) {
    console.error("Error retrieving general measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve general measurements",
      details: error.message,
    });
  }
};

const handleBodyMeasurements = async (req, res) => {

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
          occasion,
        } = req.body;
  
        // Basic validation
        if (
          !customerName ||
          !customerEmail ||
          !bust ||
          !waist ||
          !hips ||
          !height
        ) {
          return res
            .status(400)
            .json({
              error:
                "Customer name, email, bust, waist, hips, and height are required",
            });
        }
  
        // Handle image uploads
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
          console.log(
            `📸 Uploading ${req.files.length} general inspiration images to Cloudinary...`
          );
  
          const uploadPromises = req.files.map(async (file) => {
            try {
              const result = await uploadToCloudinary(file.buffer, {
                public_id: `general-inspiration-${Date.now()}-${Math.round(
                  Math.random() * 1e9
                )}`,
                folder: `reinette-vogue/general-inspiration`,
              });
  
              return {
                publicId: result.public_id,
                originalName: file.originalname,
                cloudinaryUrl: result.secure_url,
                optimizedUrl: cloudinary.url(result.public_id, {
                  quality: "auto",
                  fetch_format: "auto",
                  width: 800,
                  height: 600,
                  crop: "limit",
                }),
                size: file.size,
                format: result.format,
                width: result.width,
                height: result.height,
              };
            } catch (error) {
              console.error("Cloudinary upload error:", error);
              throw error;
            }
          });
  
          try {
            uploadedImages = await Promise.all(uploadPromises);
            console.log(
              `✅ Successfully uploaded ${uploadedImages.length} images to Cloudinary`
            );
          } catch (error) {
            console.error("Error uploading images:", error);
            return res.status(500).json({
              error: "Failed to upload images",
              details: error.message,
              timestamp: new Date().toISOString(),
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
            hasImages: uploadedImages.length > 0,
          },
        });
  
        const savedMeasurement = await newGeneralMeasurement.save();
  
        res.status(201).json({
          message:
            "Body measurements and style inspiration recorded successfully",
          measurement: savedMeasurement,
          imageCount: uploadedImages.length,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error saving general measurements:", error);
        res.status(500).json({
          error: "Failed to save measurements",
          details: error.message,
          timestamp: new Date().toISOString(),
        });
    }
  };

const handleCustomerMeasurementsByEmail = async (req, res) => {   
  try {
    const email = req.params.email;

    const [gownMeasurements, trouserMeasurements, generalMeasurements] =
      await Promise.all([
        GownMeasurement.find({ customerEmail: email }),
        TrouserMeasurement.find({ customerEmail: email }),
        GeneralMeasurement.find({ customerEmail: email }),
      ]);

    res.status(200).json({
      message: "Customer measurements retrieved successfully",
      customerEmail: email,
      measurements: {
        gown: gownMeasurements,
        trouser: trouserMeasurements,
        general: generalMeasurements,
      },
    });
  } catch (error) {
    console.error("Error retrieving customer measurements:", error);
    res.status(500).json({
      error: "Failed to retrieve customer measurements",
      details: error.message,
    });
  }
};

const handleBodyMeasurementsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        error: "Email parameter is required",
        timestamp: new Date().toISOString(),
      });
    }

    // Fetch all measurements for the customer
    const [gownMeasurements, trouserMeasurements, generalMeasurements] =
      await Promise.all([
        GownMeasurement.find({ customerEmail: email.toLowerCase() }).sort({
          createdAt: -1,
        }),
        TrouserMeasurement.find({ customerEmail: email.toLowerCase() }).sort({
          createdAt: -1,
        }),
        GeneralMeasurement.find({ customerEmail: email.toLowerCase() }).sort({
          createdAt: -1,
        }),
      ]);

    res.status(200).json({
      message: "Customer measurements retrieved successfully",
      customerEmail: email,
      measurements: {
        gowns: gownMeasurements,
        trousers: trouserMeasurements,
        general: generalMeasurements,
      },
      totalRecords:
        gownMeasurements.length +
        trouserMeasurements.length +
        generalMeasurements.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching measurements:", error);
    res.status(500).json({
      error: "Failed to fetch measurements",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const handleCustomerRequests = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      designType,
      description,
      preferredColors,
      budget,
      occasion,
    } = req.body;

    if (!customerName || !customerEmail || !designType || !description) {
      return res.status(400).json({
        error:
          "Customer name, email, design type, and description are required",
        timestamp: new Date().toISOString(),
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
      submissionDate: new Date(),
    };

    res.status(201).json({
      message: "Design request submitted successfully",
      designRequest,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error submitting design request:", error);
    res.status(500).json({
      error: "Failed to submit design request",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const handleUploadInspiration = async (req, res) => {
  try {
    const { customerName, customerEmail, designType, description } = req.body;

    if (!customerName || !customerEmail || !designType) {
      return res.status(400).json({
        error: "Customer name, email, and design type are required",
        timestamp: new Date().toISOString(),
      });
    }

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} images to Cloudinary...`);

      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            public_id: `${designType}-${Date.now()}-${Math.round(
              Math.random() * 1e9
            )}`,
            folder: `reinette-vogue/${designType}-inspiration`,
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
              quality: "auto",
              fetch_format: "auto",
              width: 800,
              height: 600,
              crop: "limit",
            }),
          };
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          throw error;
        }
      });

      try {
        imagePaths = await Promise.all(uploadPromises);
        console.log(
          `✅ Successfully uploaded ${imagePaths.length} images to Cloudinary`
        );
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return res.status(500).json({
          error: "Failed to upload images to cloud storage",
          details: error.message,
          timestamp: new Date().toISOString(),
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
      submissionDate: new Date(),
    };

    res.status(201).json({
      message:
        imagePaths.length > 0
          ? "Inspiration images and details uploaded successfully"
          : "Design requirements submitted successfully (no images)",
      inspiration: inspirationData,
      imageCount: imagePaths.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error uploading inspiration:", error);
    res.status(500).json({
      error: "Failed to upload inspiration",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const deleteCustomerMeasurements = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await Promise.all([
      GownMeasurement.deleteMany({ customerEmail: email }),
      TrouserMeasurement.deleteMany({ customerEmail: email }),
      GeneralMeasurement.deleteMany({ customerEmail: email }),
    ]);

    res.status(200).json({
      message: "Customer measurements deleted successfully",
      deletedCount: result.reduce((total, r) => total + r.deletedCount, 0),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting customer measurements:", error);
    res.status(500).json({
      error: "Failed to delete customer measurements",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Image handling functions
const handleImageByPublicId = (req, res) => {
  try {
    const { publicId } = req.params;
    const { width, height, quality, format } = req.query;

    const transformations = {
      quality: quality || "auto",
      fetch_format: format || "auto",
    };

    if (width) transformations.width = parseInt(width);
    if (height) transformations.height = parseInt(height);
    if (width && height) transformations.crop = "limit";

    const optimizedUrl = cloudinary.url(publicId, transformations);

    res.status(200).json({
      publicId,
      originalUrl: cloudinary.url(publicId),
      optimizedUrl,
      transformations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating image URL:", error);
    res.status(500).json({
      error: "Failed to generate image URL",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const handleDeleteImageByPublicId = async (req, res) => {
  try {
    const { publicId } = req.params;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.status(200).json({
        message: "Image deleted successfully",
        publicId,
        result,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(404).json({
        error: "Image not found or already deleted",
        publicId,
        result,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      error: "Failed to delete image",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
};

// Design Request Controller
const handleDesignRequest = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      designType, 
      description, 
      preferredColors, 
      budget, 
      timeline 
    } = req.body;

    // Validation
    if (!customerName || !customerEmail || !designType || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: customerName, customerEmail, designType, description"
      });
    }

    // Create design request object
    const designRequest = {
      customerName,
      customerEmail,
      designType,
      description,
      preferredColors: preferredColors || [],
      budget: budget || null,
      timeline: timeline || null,
      status: 'pending',
      createdAt: new Date(),
      requestId: `DR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // In a real application, you would save this to a database
    console.log('Design request received:', designRequest);

    res.status(201).json({
      success: true,
      message: "Design request submitted successfully",
      data: {
        requestId: designRequest.requestId,
        status: designRequest.status,
        submittedAt: designRequest.createdAt
      }
    });

  } catch (error) {
    console.error("Error handling design request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process design request",
      error: error.message
    });
  }
};

// Admin Login Controller
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    // Get admin credentials from environment variable
    let adminCredentials;
    try {
      adminCredentials = JSON.parse(process.env.ADMIN_CREDENTIALS || '[]');
    } catch (parseError) {
      console.error("Error parsing admin credentials:", parseError);
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    // Find matching admin
    const admin = adminCredentials.find(
      admin => admin.username === username && admin.password === password
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.username, 
        username: admin.username,
        role: admin.role || "admin",
        name: admin.name
      },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        token,
        admin: {
          id: admin.username,
          username: admin.username,
          name: admin.name,
          role: admin.role || "admin"
        }
      }
    });

  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};

// Dashboard Stats Controller
const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      appointments: {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      },
      measurements: {
        total: 0,
        gown: 0,
        trouser: 0,
        general: 0
      },
      customers: {
        total: 0,
        active: 0
      },
      revenue: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0
      }
    };

    try {
      // Get appointment statistics
      const appointmentStats = await Appointment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      stats.appointments.total = appointmentStats.reduce((sum, stat) => sum + stat.count, 0);
      appointmentStats.forEach(stat => {
        if (stat._id && stats.appointments.hasOwnProperty(stat._id.toLowerCase())) {
          stats.appointments[stat._id.toLowerCase()] = stat.count;
        }
      });

      // Get measurement statistics
      const [gownCount, trouserCount, generalCount] = await Promise.all([
        GownMeasurement.countDocuments(),
        TrouserMeasurement.countDocuments(),
        GeneralMeasurement.countDocuments()
      ]);

      stats.measurements.gown = gownCount;
      stats.measurements.trouser = trouserCount;
      stats.measurements.general = generalCount;
      stats.measurements.total = gownCount + trouserCount + generalCount;

      // Get unique customers count
      const uniqueCustomers = await Appointment.distinct('email');
      stats.customers.total = uniqueCustomers.length;
      stats.customers.active = uniqueCustomers.length; // Assuming all customers with appointments are active

    } catch (dbError) {
      console.warn("Database query failed, returning default stats:", dbError.message);
      // Return default stats if database queries fail
    }

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard stats",
      error: error.message
    });
  }
};

const getAllTrouserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const measurement = await TrouserMeasurement.findById(id);
    
    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: "Trouser measurement not found",
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Trouser measurement retrieved successfully",
      measurement: measurement,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving trouser measurement",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getAllGownById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const measurement = await GownMeasurement.findById(id);
    
    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: "Gown measurement not found",
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Gown measurement retrieved successfully",
      measurement: measurement,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving gown measurement",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getAllGeneralById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const measurement = await GeneralMeasurement.findById(id);
    
    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: "General measurement not found",
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: "General measurement retrieved successfully",
      measurement: measurement,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving general measurement",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};



// Export all controllers
module.exports = {
  // Appointment controllers
  handleBookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  
  // Measurement controllers
  handleGownMeasurement,
  getAllGownMeasurements,
  getAllGownById,
  getAllTrouserMeasurements,
  getAllTrouserById,
  getAllGeneralMeasurements,
  getAllGeneralById,
  getCustomerMeasurements,
  handleTrouserMeasurement,
  handleBodyMeasurements,
  handleGeneralMeasurement,
  handleCustomerRequests,
  handleBodyMeasurementsByEmail,
  deleteCustomerMeasurements,
  
  // Image controllers
  handleImageByPublicId,
  handleDeleteImageByPublicId,
  
  // Design and inspiration controllers
  handleUploadInspiration,
  handleDesignRequest,
  
  // Payment controllers
  // initializeStripePayment,
  // initializePaystackPayment,
  // verifyPaystackPayment,
  
  // Admin controllers
  adminLogin,
  getDashboardStats,
  
  // Utility controllers
  //getSupportedCurrencies,
  healthCheck,
};