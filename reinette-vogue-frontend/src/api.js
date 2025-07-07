// API Configuration
export const API_URL = "https://reinette-vogue.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  // Admin endpoints
  adminLogin: "/admin/login",
  dashboardStats: "/admin/dashboard/stats",
  
  // Appointment endpoints
  bookAppointment: "/book-appointment",
  appointments: "/appointments",
  appointmentById: (id) => `/appointments/${id}`,
  updateAppointmentStatus: (id) => `/appointments/${id}/status`,
  
  // Measurement endpoints - Gown
  gownMeasurements: "/gown-measurements",
  submitGownMeasurement: "/body-measurement/gown",
  gownById: (id) => `/gown-measurements/${id}`,
  
  // Measurement endpoints - Trouser
  trouserMeasurements: "/trouser-measurements", 
  submitTrouserMeasurement: "/body-measurement/trouser",
  trouserById: (id) => `/trouser-measurements/${id}`,
  
  // Measurement endpoints - General
  generalMeasurements: "/general-measurements",
  submitGeneralMeasurement: "/body-measurement",
  generalById: (id) => `/general-measurements/${id}`,
  
  // Customer endpoints
  customerMeasurements: (email) => `/measurements/customer/${email}`,
  customerRequests: "/customer-requests",
  deleteCustomerMeasurements: (email) => `/customer-measurements/${email}`,
  
  // Image endpoints
  uploadInspiration: "/upload-inspiration",
  imageByPublicId: (publicId) => `/image/${publicId}`,
  deleteImageByPublicId: (publicId) => `/image/${publicId}`,
  
  // Design endpoints
  designRequest: "/design-request"
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Don't set Content-Type for FormData (multipart/form-data)
  if (options.body instanceof FormData) {
    delete defaultOptions.headers['Content-Type'];
  }

  const config = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};