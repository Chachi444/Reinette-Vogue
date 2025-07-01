import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Scissors, Crown, Heart } from 'lucide-react';
import './Home.css';

// Import images
import Picture1 from '../assets/Picture1.png';
import Picture2 from '../assets/Picture2.png';
import Picture3 from '../assets/Picture3.png';

const Home = () => {
  const features = [
    {
      icon: <Crown size={48} />,
      title: "Royal Elegance",
      description: "Experience the luxury of custom-tailored garments fit for royalty"
    },
    {
      icon: <Scissors size={48} />,
      title: "Master Craftsmanship",
      description: "Each piece is meticulously crafted with attention to every detail"
    },
    {
      icon: <Heart size={48} />,
      title: "Personal Touch",
      description: "Your style, your story - we bring your vision to life"
    }
  ];

  const galleryPreview = [
    {
      id: 1,
      title: "Custom Evening Gown",
      image: Picture1,
      category: "Evening Wear"
    },
    {
      id: 2,
      title: "Elegant Traditional Dress",
      image: Picture2,
      category: "Traditional Wear"
    },
    {
      id: 3,
      title: "Bespoke Formal Wear",
      image: Picture3,
      category: "Formal Wear"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Custom-Tailored
              <span className="hero-title-accent"> Elegance</span>
            </h1>
            <p className="hero-subtitle">
              For every shape and story. Experience the art of bespoke fashion 
              where luxury meets personal style.
            </p>
            <div className="hero-buttons">
              <Link to="/book-appointment" className="btn btn-primary">
                Book Appointment
                <ArrowRight size={20} />
              </Link>
              <Link to="/gallery" className="btn btn-secondary">
                View Gallery
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-image-placeholder">
              <img src={Picture1} alt="Custom Tailoring" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose Reinette's Vogue?</h2>
            <p>We combine traditional craftsmanship with modern style to create something truly extraordinary.</p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section section-alt">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="cta-text">
              <h2>Ready to Create Your Perfect Look?</h2>
              <p>Book a consultation today and let us bring your vision to life with our expert tailoring services.</p>
            </div>
            <div className="cta-buttons">
              <Link to="/book-appointment" className="btn btn-primary">
                Book Now
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="gallery-preview section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Gallery</h2>
            <p>Take a look at some of our beautiful custom creations</p>
          </motion.div>
          
          <div className="gallery-preview-grid">
            {galleryPreview.slice(0, 2).map((item, index) => (
              <motion.div 
                key={item.id}
                className="gallery-preview-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="gallery-preview-image">
                  <img src={item.image} alt={item.title} />
                  <div className="gallery-preview-overlay">
                    <span className="gallery-category">{item.category}</span>
                    <h3>{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="gallery-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/gallery" className="btn btn-primary">
              View Full Gallery
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
