const express = require("express");
const multer = require("multer");
require("dotenv").config();

// Configure multer for file uploads
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

const {
  handleBookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
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
  handleImageByPublicId,
  handleDeleteImageByPublicId,
  handleUploadInspiration,
  handleDesignRequest,
  adminLogin,
  getDashboardStats,
  healthCheck } = require("../Controllers/Index");

const router = express.Router();


router.post("/book-appointment", handleBookAppointment);

router.post(
  "/body-measurement/gown",
  upload.array("inspirationImages", 5),
  handleGownMeasurement
);

router.post("/body-measurement/trouser",
  upload.array("inspirationImages", 5),
  handleTrouserMeasurement
);

router.post("/body-measurement", upload.array("inspirationImages", 5), handleBodyMeasurements);

// GET endpoints to retrieve data

// Get all appointments
router.get("/appointments", getAllAppointments);

// Get appointment by ID
router.get("/appointments/:id", getAppointmentById);

// Get all gown measurements
router.get("/gown-measurements", getAllGownMeasurements);

// Get all trouser measurements
router.get("/trouser-measurements", getAllTrouserMeasurements);

// Get all general measurements
router.get("/general-measurements", getAllGeneralMeasurements);

// Get measurements by customer email
router.get("/measurements/customer/:email", getCustomerMeasurements);

// Get specific measurements by ID
router.get("/gown-measurements/:id", getAllGownById);
router.get("/trouser-measurements/:id", getAllTrouserById);
router.get("/general-measurements/:id", getAllGeneralById);

router.post(
  "/upload-inspiration",
  upload.array("inspirationImages", 5),
  handleUploadInspiration
);

router.post("/design-request", handleDesignRequest);

router.get("/body-measurement/:email", handleBodyMeasurementsByEmail);

// Get optimized image URL from Cloudinary
router.get("/image/:publicId", handleImageByPublicId);

// Delete image from Cloudinary
router.delete("/image/:publicId", handleDeleteImageByPublicId);

router.post("/admin/login", adminLogin);

// Get dashboard statistics
router.get("/admin/dashboard/stats", getDashboardStats);

// Update appointment status
router.put("/appointments/:id/status", updateAppointmentStatus);

// Customer requests endpoint
router.get("/customer-requests", handleCustomerRequests);

// Delete customer measurements endpoint
router.delete("/customer-measurements/:email", deleteCustomerMeasurements);

module.exports = router;