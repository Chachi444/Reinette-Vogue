import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Heart, Clock } from 'lucide-react';
import './About.css';

// Import images
import Picture2 from '../assets/Picture2.png';

const About = () => {
  const stats = [
    { icon: <Users />, value: "100+", label: "Happy Clients" },
    { icon: <Award />, value: "5+", label: "Years Experience" },
    { icon: <Heart />, value: "1000+", label: "Custom Pieces" },
    { icon: <Clock />, value: "24/7", label: "Support" }
  ];

  return (
    <div className="about">
      <div className="about-hero">
        <div className="container">
          <motion.div 
            className="about-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About Reinette's Vogue</h1>
            <p>Where passion meets precision in the art of bespoke tailoring</p>
          </motion.div>
        </div>
      </div>

      <div className="about-content section">
        <div className="container">
          <div className="about-story">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Founded with a passion for creating exceptional garments, Reinette's Vogue has been 
                transforming the way people experience fashion for over a decade. Our journey began 
                with a simple belief: everyone deserves to feel confident and beautiful in perfectly 
                fitted clothing.
              </p>
              <p>
                We combine traditional tailoring techniques with modern design sensibilities to 
                create pieces that are not just clothing, but works of art that tell your unique story.
              </p>
            </div>
            <div className="about-image">
              <img src={Picture2} alt="Our Atelier" />
            </div>
          </div>

          <div className="about-stats">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
