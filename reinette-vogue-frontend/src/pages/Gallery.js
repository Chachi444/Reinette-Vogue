import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Gallery.css';

// Import images
import Picture1 from '../assets/Picture1.png';
import Picture2 from '../assets/Picture2.png';
import Picture3 from '../assets/Picture3.png';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Work' },
    { id: 'gowns', label: 'Evening Gowns' },
    { id: 'traditional', label: 'Traditional Bridal' },
    { id: 'casual', label: 'Casual Wear' },
    { id: 'formal', label: 'Formal Wear' }
  ];

  const galleryItems = [
    { id: 1, category: 'gowns', title: 'Elegant Evening Gown', image: Picture1 },
    { id: 2, category: 'traditional', title: 'Traditional Bridal Dress', image: Picture2 },
    { id: 3, category: 'formal', title: 'Custom Formal Wear', image: Picture3 },
    { id: 4, category: 'gowns', title: 'Cocktail Dress', image: Picture1 },
    { id: 5, category: 'traditional', title: 'African Traditional Gown', image: Picture2 },
    { id: 6, category: 'casual', title: 'Tailored Casual Outfit', image: Picture3 },
    { id: 7, category: 'formal', title: 'Bespoke Formal Dress', image: Picture1 },
    { id: 8, category: 'traditional', title: 'Cultural Wedding Attire', image: Picture2 },
    { id: 9, category: 'gowns', title: 'Red Carpet Gown', image: Picture3 },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="gallery">
      <div className="gallery-hero">
        <div className="container">
          <motion.div 
            className="gallery-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Our Gallery</h1>
            <p>Discover our collection of bespoke creations</p>
          </motion.div>
        </div>
      </div>

      <div className="gallery-content section">
        <div className="container">
          <div className="gallery-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="gallery-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="gallery-image">
                  <img src={item.image} alt={item.title} />
                  <div className="gallery-overlay">
                    <h3>{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
