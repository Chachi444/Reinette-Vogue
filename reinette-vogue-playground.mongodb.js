/* global use, db */
// REINETTE-VOGUE MongoDB Playground
// Test database operations for your fashion business
// Make sure you're connected to your MongoDB Atlas cluster

// Select your actual database (check your MongoDB Atlas cluster for the correct name)
use('test'); // Replace 'test' with your actual database name

// ==========================================
// 1. TEST APPOINTMENTS COLLECTION
// ==========================================

console.log("=== Testing Appointments ===");

// Insert a sample appointment
const sampleAppointment = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  date: new Date('2025-07-15'),
  time: "2:00 PM",
  appointmentType: "consultation",
  notes: "Interested in custom evening gown for gala event",
  createdAt: new Date()
};

db.appointments.insertOne(sampleAppointment);

// Find all appointments
const allAppointments = db.appointments.find().toArray();
console.log(`Total appointments: ${allAppointments.length}`);

// ==========================================
// 2. TEST GOWN MEASUREMENTS COLLECTION
// ==========================================

console.log("=== Testing Gown Measurements ===");

// Insert sample gown measurements
const sampleGownMeasurement = {
  customerName: "Sarah Johnson",
  customerEmail: "sarah.johnson@email.com",
  // Measurements in inches
  shoulder: 15.5,
  bust: 36,
  bustPan: 34,
  upperChest: 35,
  bustPoint: 9,
  underBust: 32,
  halfLength: 22,
  basque: 30,
  waist: 28,
  hipPoint: 10,
  hips: 38,
  armhole: 17,
  sleeve: 25,
  roundSleeve: 15,
  back: 16,
  knee: 22,
  fullLength: 62,
  notes: "Client prefers fitted bodice with flowing skirt",
  estimatedDelivery: new Date('2025-09-01'),
  styleInspiration: {
    description: "Classic A-line evening gown with beaded bodice",
    preferredColors: "Navy Blue, Midnight Blue",
    occasion: "Charity Gala",
    hasImages: false,
    images: []
  },
  createdAt: new Date()
};

db.gownmeasurements.insertOne(sampleGownMeasurement);

// Find gown measurements by customer email
const customerGownMeasurements = db.gownmeasurements.find({
  customerEmail: "sarah.johnson@email.com"
}).toArray();
console.log(`Gown measurements for customer: ${customerGownMeasurements.length}`);

// ==========================================
// 3. TEST TROUSER MEASUREMENTS COLLECTION
// ==========================================

console.log("=== Testing Trouser Measurements ===");

// Insert sample trouser measurements
const sampleTrouserMeasurement = {
  customerName: "Michael Chen",
  customerEmail: "michael.chen@email.com",
  waist: 32,
  hips: 38,
  crotch: 12,
  laps: 24,
  trouserLength: 42,
  notes: "Client prefers slim fit style",
  estimatedDelivery: new Date('2025-08-15'),
  styleInspiration: {
    description: "Modern slim-fit dress pants for business",
    preferredColors: "Charcoal Gray, Navy",
    occasion: "Business meetings",
    hasImages: false,
    images: []
  },
  createdAt: new Date()
};

db.trousermeasurements.insertOne(sampleTrouserMeasurement);

// ==========================================
// 4. TEST GENERAL MEASUREMENTS COLLECTION
// ==========================================

console.log("=== Testing General Measurements ===");

// Insert sample general measurements
const sampleGeneralMeasurement = {
  customerName: "Emma Wilson",
  customerEmail: "emma.wilson@email.com",
  bust: 34,
  waist: 26,
  hips: 36,
  height: 65, // inches
  notes: "Client interested in versatile wardrobe pieces",
  styleInspiration: {
    description: "Professional yet stylish everyday wear",
    preferredColors: "Black, White, Cream",
    occasion: "Work and casual events",
    hasImages: false,
    images: []
  },
  createdAt: new Date()
};

db.generalmeasurements.insertOne(sampleGeneralMeasurement);

// ==========================================
// 5. USEFUL QUERIES FOR YOUR BUSINESS
// ==========================================

console.log("=== Business Analytics Queries ===");

// Get all appointments for this month
const thisMonth = new Date();
thisMonth.setDate(1);
const nextMonth = new Date(thisMonth);
nextMonth.setMonth(nextMonth.getMonth() + 1);

const monthlyAppointments = db.appointments.find({
  date: {
    $gte: thisMonth,
    $lt: nextMonth
  }
}).count();
console.log(`Appointments this month: ${monthlyAppointments}`);

// Get customers with multiple measurements (repeat customers)
const repeatCustomers = db.gownmeasurements.aggregate([
  {
    $group: {
      _id: "$customerEmail",
      count: { $sum: 1 },
      customerName: { $first: "$customerName" }
    }
  },
  {
    $match: { count: { $gt: 1 } }
  }
]).toArray();
console.log(`Repeat customers: ${repeatCustomers.length}`);

// Get upcoming deliveries (next 30 days)
const today = new Date();
const thirtyDaysFromNow = new Date();
thirtyDaysFromNow.setDate(today.getDate() + 30);

const upcomingDeliveries = db.gownmeasurements.find({
  estimatedDelivery: {
    $gte: today,
    $lte: thirtyDaysFromNow
  }
}).toArray();
console.log(`Deliveries in next 30 days: ${upcomingDeliveries.length}`);

// ==========================================
// 6. CLEANUP (OPTIONAL)
// ==========================================

// Uncomment these lines if you want to remove test data
// db.appointments.deleteMany({ email: { $regex: "@email.com$" } });
// db.gownmeasurements.deleteMany({ customerEmail: { $regex: "@email.com$" } });
// db.trousermeasurements.deleteMany({ customerEmail: { $regex: "@email.com$" } });
// db.generalmeasurements.deleteMany({ customerEmail: { $regex: "@email.com$" } });

console.log("=== Playground completed! ===");
