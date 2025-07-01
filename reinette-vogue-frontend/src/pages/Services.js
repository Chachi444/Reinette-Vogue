import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Services.css';

const Services = () => {
  const coreServices = [
    {
      title: "Custom Clothing Design",
      description: "Beautifully made outfits ranging from English wear to traditional styles."
    },
    {
      title: "Alterations & Repairs",
      description: "Whether it's adjusting a hem, fixing a zip, or tightening a loose fit, we'll give your clothes a perfect touch."
    },
    {
      title: "Resizing Services",
      description: "Lost or gained a little weight? We'll adjust your outfit so it fits just right."
    }
  ];

  const specialServices = [
    {
      title: "Wedding & Bridal Wear",
      description: "From engagement to reception, we handle traditional wedding attire, bridesmaids' dresses, and more with love and attention to detail."
    },
    {
      title: "Outfits for Events",
      description: "Planning for birthdays, naming ceremonies, housewarming parties, or owambes? We create standout looks for special days."
    },
    {
      title: "Style Consultation & Sketching",
      description: "We help you choose styles that complement your body and personality—and we can sketch your dream outfit too."
    },
    {
      title: "Transforming Old Clothes",
      description: "Got something in your wardrobe you no longer wear? Let's revamp it into a style you'll love again."
    }
  ];

  const extraServices = [
    {
      title: "Home Measurements & Fittings",
      description: "Busy schedule? We'll come to your home for measurement and fitting, at your convenience."
    },
    {
      title: "Express Service",
      description: "Need it urgently? We offer fast-tracked tailoring for those last-minute occasions."
    },
    {
      title: "Styling Support",
      description: "Not sure which colour or fabric to go with? We'll guide you to make the best choice for your skin tone, body shape, and vibe."
    },
    {
      title: "Fabric Shopping Help",
      description: "If you need help buying fabric, we can recommend or even help you source affordable, high-quality materials."
    }
  ];

  return (
    <div className="services">
      <div className="services-hero">
        <div className="container">
          <motion.div 
            className="services-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Our Tailoring Services</h1>
            <p>Expert craftsmanship and premium materials for every garment we create</p>
          </motion.div>
        </div>
      </div>

      <div className="services-content section">
        <div className="container">
          {/* Core Services */}
          <div className="services-section">
            <h2 className="section-title">Core Services</h2>
            <div className="extra-services-grid">
              {coreServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="extra-service-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Special Occasion Services */}
          <div className="services-section">
            <h2 className="section-title">Special Occasion Services</h2>
            <div className="extra-services-grid">
              {specialServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="extra-service-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Extra Services */}
          <div className="services-section">
            <h2 className="section-title">Extra Services That Matter</h2>
            <div className="extra-services-grid">
              {extraServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="extra-service-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fabric Selection Highlight */}
          <motion.div 
            className="fabric-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Best Fabric Selection for Your Dress</h2>
            <p>Whether it's lace, crepe, velvet, chiffon, or traditional Ankara, we'll help you find the perfect fabric that matches your style, budget, and event. Our expertise in fabric selection ensures your garment not only looks stunning but feels comfortable and lasts for years to come.</p>
            <div className="fabric-types">
              <span className="fabric-tag">Lace</span>
              <span className="fabric-tag">Crepe</span>
              <span className="fabric-tag">Velvet</span>
              <span className="fabric-tag">Chiffon</span>
              <span className="fabric-tag">Ankara</span>
              <span className="fabric-tag">Silk</span>
              <span className="fabric-tag">Cotton</span>
              <span className="fabric-tag">Satin</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="services-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Create Something Beautiful?</h2>
            <p>Let's discuss your vision and bring it to life with expert craftsmanship and the finest materials.</p>
            <Link to="/book-appointment" className="btn btn-primary">
              Schedule Your Consultation
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Services;
