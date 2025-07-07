import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { API_ENDPOINTS, apiCall } from '../api';
import './BookAppointment.css';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    appointmentType: 'consultation',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const appointmentTypes = [
    { value: 'consultation', label: 'Initial Consultation' },
    { value: 'fitting', label: 'Fitting Appointment' },
    { value: 'pickup', label: 'Pickup/Delivery' },
    { value: 'design_discussion', label: 'Design Discussion' },
    { value: 'measurement', label: 'Measurements' }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with your backend URL
      const response = await apiCall(API_ENDPOINTS.bookAppointment, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitMessage('Appointment booked successfully! We will contact you soon.');
        setFormData({
          name: '',
          email: '',
          date: '',
          time: '',
          appointmentType: 'consultation',
          notes: ''
        });
      } else {
        setSubmitMessage('Error booking appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Error booking appointment. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="book-appointment">
      <div className="appointment-hero">
        <div className="container">
          <motion.div 
            className="appointment-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Book Your Appointment</h1>
            <p>Schedule a consultation to discuss your vision and begin your bespoke journey</p>
          </motion.div>
        </div>
      </div>

      <div className="appointment-content section">
        <div className="container">
          <div className="appointment-layout">
            <motion.div 
              className="appointment-info"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2>What to Expect</h2>
              <div className="info-item">
                <User className="info-icon" />
                <div>
                  <h3>Personal Consultation</h3>
                  <p>We'll discuss your vision, style preferences, and specific requirements.</p>
                </div>
              </div>
              <div className="info-item">
                <Calendar className="info-icon" />
                <div>
                  <h3>Measurements</h3>
                  <p>Precise measurements will be taken to ensure the perfect fit.</p>
                </div>
              </div>
              <div className="info-item">
                <Clock className="info-icon" />
                <div>
                  <h3>Timeline Discussion</h3>
                  <p>We'll establish a timeline for your project and schedule fittings.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="appointment-form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Preferred Time</label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="appointmentType">Appointment Type</label>
                  <select
                    id="appointmentType"
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleChange}
                    required
                  >
                    {appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Tell us about your project, style preferences, or any specific requirements..."
                    rows="4"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Book Appointment'}
                </button>

                {submitMessage && (
                  <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
