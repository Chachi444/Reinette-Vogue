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
      content: "+234-904-547-8863",
      action: "tel:+2349045478863"
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      content: "reinettevogue@gmail.com",
      action: "mailto:reinettevogue@gmail.com"
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
                  <a href="https://www.instagram.com/reinettes_vogue?igsh=MXNpbjd4YWs5MXE3dQ%3D%3D&utm_source=qr" className="social-link">Instagram</a>
                  <a href="https://www.facebook.com/esther.godwin.773028" className="social-link">Facebook</a>
                  <a href="https://www.tiktok.com/@reinettes_vogue?_r=1&_d=ed3l78mlk93a1a&sec_uid=MS4wLjABAAAAvZN8ql8_hRROui-xA1MxLKZRz2PxLzyn_Iq1zufLaWCJtKwVnCWuf_ogBAZRJMrk&share_author_id=6878664936374699009&sharer_language=en&source=h5_m&u_code=dek7mlb75h44ig&ug_btm=b8727,b0&social_share_type=4&utm_source=copy&sec_user_id=MS4wLjABAAAAvZN8ql8_hRROui-xA1MxLKZRz2PxLzyn_Iq1zufLaWCJtKwVnCWuf_ogBAZRJMrk&tt_from=copy&utm_medium=ios&utm_campaign=client_share&enable_checksum=1&user_id=6878664936374699009&share_link_id=A1F7BFCB-7F7A-42BC-9D24-F167A7B7DB2F&share_app_id=1233" className="social-link">TikTok</a>
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
