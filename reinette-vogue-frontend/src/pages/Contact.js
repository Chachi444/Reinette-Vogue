import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "Phone",
      content: "0816-766-2286",
      action: "tel:+2348167662286"
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      content: "info@reinettesvogue.com",
      action: "mailto:info@reinettesvogue.com"
    },
    {
      icon: <MapPin size={24} />,
      title: "Location",
      content: "Lagos, Nigeria",
      action: null
    },
    {
      icon: <Clock size={24} />,
      title: "Hours",
      content: "Mon-Sat: 9AM-6PM",
      action: null
    }
  ];

  return (
    <div className="contact">
      <div className="contact-hero">
        <div className="container">
          <motion.div 
            className="contact-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Get In Touch</h1>
            <p>Ready to create something beautiful? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </div>

      <div className="contact-content section">
        <div className="container">
          <div className="contact-layout">
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2>Contact Information</h2>
              <p className="contact-description">
                Have questions about our services or ready to start your bespoke journey? 
                Reach out to us through any of the following channels.
              </p>

              <div className="contact-items">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-item">
                    <div className="contact-icon">
                      {item.icon}
                    </div>
                    <div className="contact-details">
                      <h3>{item.title}</h3>
                      {item.action ? (
                        <a href={item.action} className="contact-link">
                          {item.content}
                        </a>
                      ) : (
                        <span>{item.content}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-extra">
                <h3>Follow Us</h3>
                <p>Stay updated with our latest creations and behind-the-scenes content.</p>
                <div className="social-links">
                  <a href="https://instagram.com/reinettesvogue" className="social-link">Instagram</a>
                  <a href="https://facebook.com/reinettesvogue" className="social-link">Facebook</a>
                  <a href="https://pinterest.com/reinettesvogue" className="social-link">Pinterest</a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="contact-form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit}>
                <h2>Send us a Message</h2>
                
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

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or ask any questions..."
                    rows="6"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div className="submit-message success">
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

export default Contact;
