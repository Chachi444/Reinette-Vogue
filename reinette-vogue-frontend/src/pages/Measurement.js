import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, User, Package, Upload, X, Clock } from 'lucide-react';
import { API_ENDPOINTS, apiCall } from '../api';
import './Measurement.css';

const Measurement = () => {
  const [activeTab, setActiveTab] = useState('gown');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState({
    gown: [],
    trouser: [],
    general: []
  });
  const [previewImages, setPreviewImages] = useState({
    gown: [],
    trouser: [],
    general: []
  });

  // Form state for different measurement types
  const [gownData, setGownData] = useState({
    customerName: '',
    customerEmail: '',
    shoulder: '',
    bust: '',
    bustPan: '',
    upperChest: '',
    bustPoint: '',
    underBust: '',
    halfLength: '',
    basque: '',
    waist: '',
    hipPoint: '',
    hips: '',
    armhole: '',
    sleeve: '',
    roundSleeve: '',
    back: '',
    knee: '',
    fullLength: '',
    measurementUnit: 'inches',
    notes: '',
    estimatedDelivery: '',
    styleDescription: '',
    preferredColors: '',
    occasion: ''
  });

  const [trouserData, setTrouserData] = useState({
    customerName: '',
    customerEmail: '',
    waist: '',
    hips: '',
    crotch: '',
    laps: '',
    trouserLength: '',
    measurementUnit: 'inches',
    notes: '',
    estimatedDelivery: '',
    styleDescription: '',
    preferredColors: '',
    occasion: ''
  });

  const [generalData, setGeneralData] = useState({
    customerName: '',
    customerEmail: '',
    bust: '',
    waist: '',
    hips: '',
    height: '',
    measurementUnit: 'inches',
    notes: '',
    styleDescription: '',
    preferredColors: '',
    occasion: ''
  });

  const tabs = [
    { id: 'gown', label: 'Gown Measurements', icon: <Package size={20} /> },
    { id: 'trouser', label: 'Trouser Measurements', icon: <User size={20} /> },
    { id: 'general', label: 'General Measurements', icon: <Ruler size={20} /> }
  ];

  const handleGownChange = (e) => {
    setGownData({
      ...gownData,
      [e.target.name]: e.target.value
    });
  };

  const handleTrouserChange = (e) => {
    setTrouserData({
      ...trouserData,
      [e.target.name]: e.target.value
    });
  };

  const handleGeneralChange = (e) => {
    setGeneralData({
      ...generalData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e, tabType) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages[tabType].length > 5) {
      alert('You can only upload up to 5 images per measurement type.');
      return;
    }

    const newImages = [...selectedImages[tabType], ...files];
    setSelectedImages({
      ...selectedImages,
      [tabType]: newImages
    });

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages({
      ...previewImages,
      [tabType]: [...previewImages[tabType], ...newPreviews]
    });
  };

  const removeImage = (index, tabType) => {
    const newImages = selectedImages[tabType].filter((_, i) => i !== index);
    const newPreviews = previewImages[tabType].filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewImages[tabType][index]);
    
    setSelectedImages({
      ...selectedImages,
      [tabType]: newImages
    });
    setPreviewImages({
      ...previewImages,
      [tabType]: newPreviews
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let endpoint = '';
      let formData = new FormData();
      let measurementData = {};
      
      switch (activeTab) {
        case 'gown':
          endpoint = API_ENDPOINTS.submitGownMeasurement;
          measurementData = gownData;
          selectedImages.gown.forEach((file, index) => {
            formData.append('inspirationImages', file);
          });
          break;
        case 'trouser':
          endpoint = API_ENDPOINTS.submitTrouserMeasurement;
          measurementData = trouserData;
          selectedImages.trouser.forEach((file, index) => {
            formData.append('inspirationImages', file);
          });
          break;
        case 'general':
          endpoint = API_ENDPOINTS.submitGeneralMeasurement;
          measurementData = generalData;
          selectedImages.general.forEach((file, index) => {
            formData.append('inspirationImages', file);
          });
          break;
        default:
          break;
      }

      // Add measurement data to FormData
      Object.keys(measurementData).forEach(key => {
        if (measurementData[key] !== '') {
          formData.append(key, measurementData[key]);
        }
      });

      // Add style inspiration description
      formData.append('styleDescription', measurementData.styleDescription || '');
      formData.append('preferredColors', measurementData.preferredColors || '');
      formData.append('occasion', measurementData.occasion || '');

      const response = await apiCall(endpoint, {
        method: 'POST',
        body: formData, // Using FormData instead of JSON for file upload
      });

      if (response.ok) {
        setSubmitMessage('Measurements and style inspiration submitted successfully! We will contact you soon.');
        // Reset forms and images
        switch (activeTab) {
          case 'gown':
            setGownData({
              customerName: '',
              customerEmail: '',
              shoulder: '',
              bust: '',
              bustPan: '',
              upperChest: '',
              bustPoint: '',
              underBust: '',
              halfLength: '',
              basque: '',
              waist: '',
              hipPoint: '',
              hips: '',
              armhole: '',
              sleeve: '',
              roundSleeve: '',
              back: '',
              knee: '',
              fullLength: '',
              measurementUnit: 'inches',
              notes: '',
              estimatedDelivery: '',
              styleDescription: '',
              preferredColors: '',
              occasion: ''
            });
            break;
          case 'trouser':
            setTrouserData({
              customerName: '',
              customerEmail: '',
              waist: '',
              hips: '',
              crotch: '',
              laps: '',
              trouserLength: '',
              measurementUnit: 'inches',
              notes: '',
              estimatedDelivery: '',
              styleDescription: '',
              preferredColors: '',
              occasion: ''
            });
            break;
          case 'general':
            setGeneralData({
              customerName: '',
              customerEmail: '',
              bust: '',
              waist: '',
              hips: '',
              height: '',
              measurementUnit: 'inches',
              notes: '',
              styleDescription: '',
              preferredColors: '',
              occasion: ''
            });
            break;
          default:
            break;
        }
        
        // Clear images
        previewImages[activeTab].forEach(url => URL.revokeObjectURL(url));
        setSelectedImages({
          ...selectedImages,
          [activeTab]: []
        });
        setPreviewImages({
          ...previewImages,
          [activeTab]: []
        });
      } else {
        setSubmitMessage('Error submitting measurements. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Error submitting measurements. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="measurement">
      <div className="measurement-hero">
        <div className="container">
          <motion.div 
            className="measurement-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Custom Measurements</h1>
            <p>Precise measurements for the perfect fit - because every body is unique</p>
          </motion.div>
        </div>
      </div>

      <div className="measurement-content section">
        <div className="container">
          <div className="measurement-layout">
            <motion.div 
              className="measurement-info"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2>Measurement Guidelines</h2>
              <div className="info-item">
                <Ruler className="info-icon" />
                <div>
                  <h3>Accurate Measurements</h3>
                  <p>Use a flexible measuring tape and measure over lightweight clothing for best results.</p>
                </div>
              </div>
              <div className="info-item">
                <User className="info-icon" />
                <div>
                  <h3>Professional Service</h3>
                  <p>For the most accurate fit, we recommend scheduling an in-person measurement session.</p>
                </div>
              </div>
              <div className="info-item">
                <Clock className="info-icon" />
                <div>
                  <h3>Processing Time</h3>
                  <p>We'll review your measurements and contact you within 24 hours to confirm your order.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="measurement-form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="measurement-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Customer Information (common for all tabs) */}
                <div className="form-section">
                  <h3>Customer Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="customerName">Full Name</label>
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={
                          activeTab === 'gown' ? gownData.customerName :
                          activeTab === 'trouser' ? trouserData.customerName :
                          generalData.customerName
                        }
                        onChange={
                          activeTab === 'gown' ? handleGownChange :
                          activeTab === 'trouser' ? handleTrouserChange :
                          handleGeneralChange
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="customerEmail">Email Address</label>
                      <input
                        type="email"
                        id="customerEmail"
                        name="customerEmail"
                        value={
                          activeTab === 'gown' ? gownData.customerEmail :
                          activeTab === 'trouser' ? trouserData.customerEmail :
                          generalData.customerEmail
                        }
                        onChange={
                          activeTab === 'gown' ? handleGownChange :
                          activeTab === 'trouser' ? handleTrouserChange :
                          handleGeneralChange
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Measurement Unit Selection */}
                <div className="form-group">
                  <label htmlFor="measurementUnit">Measurement Unit</label>
                  <select
                    id="measurementUnit"
                    name="measurementUnit"
                    value={
                      activeTab === 'gown' ? gownData.measurementUnit :
                      activeTab === 'trouser' ? trouserData.measurementUnit :
                      generalData.measurementUnit
                    }
                    onChange={
                      activeTab === 'gown' ? handleGownChange :
                      activeTab === 'trouser' ? handleTrouserChange :
                      handleGeneralChange
                    }
                  >
                    <option value="inches">Inches</option>
                    <option value="centimeters">Centimeters</option>
                  </select>
                </div>

                {/* Gown Measurements */}
                {activeTab === 'gown' && (
                  <div className="form-section">
                    <h3>Gown Measurements</h3>
                    <div className="measurement-grid">
                      <div className="form-group">
                        <label htmlFor="shoulder">Shoulder</label>
                        <input
                          type="number"
                          step="0.1"
                          id="shoulder"
                          name="shoulder"
                          value={gownData.shoulder}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="bust">Bust</label>
                        <input
                          type="number"
                          step="0.1"
                          id="bust"
                          name="bust"
                          value={gownData.bust}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="bustPan">Bust Pan</label>
                        <input
                          type="number"
                          step="0.1"
                          id="bustPan"
                          name="bustPan"
                          value={gownData.bustPan}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="upperChest">Upper Chest</label>
                        <input
                          type="number"
                          step="0.1"
                          id="upperChest"
                          name="upperChest"
                          value={gownData.upperChest}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="bustPoint">Bust Point</label>
                        <input
                          type="number"
                          step="0.1"
                          id="bustPoint"
                          name="bustPoint"
                          value={gownData.bustPoint}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="underBust">Under Bust</label>
                        <input
                          type="number"
                          step="0.1"
                          id="underBust"
                          name="underBust"
                          value={gownData.underBust}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="halfLength">Half Length</label>
                        <input
                          type="number"
                          step="0.1"
                          id="halfLength"
                          name="halfLength"
                          value={gownData.halfLength}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="basque">Basque</label>
                        <input
                          type="number"
                          step="0.1"
                          id="basque"
                          name="basque"
                          value={gownData.basque}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="waist">Waist</label>
                        <input
                          type="number"
                          step="0.1"
                          id="waist"
                          name="waist"
                          value={gownData.waist}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hipPoint">Hip Point</label>
                        <input
                          type="number"
                          step="0.1"
                          id="hipPoint"
                          name="hipPoint"
                          value={gownData.hipPoint}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hips">Hips</label>
                        <input
                          type="number"
                          step="0.1"
                          id="hips"
                          name="hips"
                          value={gownData.hips}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="armhole">Armhole</label>
                        <input
                          type="number"
                          step="0.1"
                          id="armhole"
                          name="armhole"
                          value={gownData.armhole}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sleeve">Sleeve</label>
                        <input
                          type="number"
                          step="0.1"
                          id="sleeve"
                          name="sleeve"
                          value={gownData.sleeve}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="roundSleeve">Round Sleeve</label>
                        <input
                          type="number"
                          step="0.1"
                          id="roundSleeve"
                          name="roundSleeve"
                          value={gownData.roundSleeve}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="back">Back</label>
                        <input
                          type="number"
                          step="0.1"
                          id="back"
                          name="back"
                          value={gownData.back}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="knee">Knee</label>
                        <input
                          type="number"
                          step="0.1"
                          id="knee"
                          name="knee"
                          value={gownData.knee}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="fullLength">Full Length</label>
                        <input
                          type="number"
                          step="0.1"
                          id="fullLength"
                          name="fullLength"
                          value={gownData.fullLength}
                          onChange={handleGownChange}
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="estimatedDelivery">Estimated Delivery Date</label>
                      <input
                        type="date"
                        id="estimatedDelivery"
                        name="estimatedDelivery"
                        value={gownData.estimatedDelivery}
                        onChange={handleGownChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                )}

                {/* Trouser Measurements */}
                {activeTab === 'trouser' && (
                  <div className="form-section">
                    <h3>Trouser Measurements</h3>
                    <div className="measurement-grid">
                      <div className="form-group">
                        <label htmlFor="waist">Waist</label>
                        <input
                          type="number"
                          step="0.1"
                          id="waist"
                          name="waist"
                          value={trouserData.waist}
                          onChange={handleTrouserChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hips">Hips</label>
                        <input
                          type="number"
                          step="0.1"
                          id="hips"
                          name="hips"
                          value={trouserData.hips}
                          onChange={handleTrouserChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="crotch">Crotch</label>
                        <input
                          type="number"
                          step="0.1"
                          id="crotch"
                          name="crotch"
                          value={trouserData.crotch}
                          onChange={handleTrouserChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="laps">Laps</label>
                        <input
                          type="number"
                          step="0.1"
                          id="laps"
                          name="laps"
                          value={trouserData.laps}
                          onChange={handleTrouserChange}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="trouserLength">Trouser Length</label>
                        <input
                          type="number"
                          step="0.1"
                          id="trouserLength"
                          name="trouserLength"
                          value={trouserData.trouserLength}
                          onChange={handleTrouserChange}
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="estimatedDelivery">Estimated Delivery Date</label>
                      <input
                        type="date"
                        id="estimatedDelivery"
                        name="estimatedDelivery"
                        value={trouserData.estimatedDelivery}
                        onChange={handleTrouserChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                )}

                {/* General Measurements */}
                {activeTab === 'general' && (
                  <div className="form-section">
                    <h3>General Measurements</h3>
                    <div className="measurement-grid">
                      <div className="form-group">
                        <label htmlFor="bust">Bust</label>
                        <input
                          type="number"
                          step="0.1"
                          id="bust"
                          name="bust"
                          value={generalData.bust}
                          onChange={handleGeneralChange}
                          placeholder="0.0"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="waist">Waist</label>
                        <input
                          type="number"
                          step="0.1"
                          id="waist"
                          name="waist"
                          value={generalData.waist}
                          onChange={handleGeneralChange}
                          placeholder="0.0"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hips">Hips</label>
                        <input
                          type="number"
                          step="0.1"
                          id="hips"
                          name="hips"
                          value={generalData.hips}
                          onChange={handleGeneralChange}
                          placeholder="0.0"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="height">Height</label>
                        <input
                          type="number"
                          step="0.1"
                          id="height"
                          name="height"
                          value={generalData.height}
                          onChange={handleGeneralChange}
                          placeholder="0.0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Style Inspiration Section */}
                <div className="form-section">
                  <h3>Style Inspiration</h3>
                  <p className="section-description">
                    Upload inspiration images and describe your vision to help us create your perfect design.
                  </p>
                  
                  <div className="form-group">
                    <label htmlFor="styleDescription">Design Description</label>
                    <textarea
                      id="styleDescription"
                      name="styleDescription"
                      value={
                        activeTab === 'gown' ? gownData.styleDescription :
                        activeTab === 'trouser' ? trouserData.styleDescription :
                        generalData.styleDescription
                      }
                      onChange={
                        activeTab === 'gown' ? handleGownChange :
                        activeTab === 'trouser' ? handleTrouserChange :
                        handleGeneralChange
                      }
                      placeholder="Describe your dream design, style preferences, details you'd like to include..."
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="preferredColors">Preferred Colors</label>
                      <input
                        type="text"
                        id="preferredColors"
                        name="preferredColors"
                        value={
                          activeTab === 'gown' ? gownData.preferredColors :
                          activeTab === 'trouser' ? trouserData.preferredColors :
                          generalData.preferredColors
                        }
                        onChange={
                          activeTab === 'gown' ? handleGownChange :
                          activeTab === 'trouser' ? handleTrouserChange :
                          handleGeneralChange
                        }
                        placeholder="e.g., Burgundy, Gold, Navy Blue"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="occasion">Occasion</label>
                      <input
                        type="text"
                        id="occasion"
                        name="occasion"
                        value={
                          activeTab === 'gown' ? gownData.occasion :
                          activeTab === 'trouser' ? trouserData.occasion :
                          generalData.occasion
                        }
                        onChange={
                          activeTab === 'gown' ? handleGownChange :
                          activeTab === 'trouser' ? handleTrouserChange :
                          handleGeneralChange
                        }
                        placeholder="e.g., Wedding, Business, Evening Party"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="form-group">
                    <label>Inspiration Images (Optional)</label>
                    <div className="image-upload-section">
                      <div className="upload-area">
                        <input
                          type="file"
                          id={`images-${activeTab}`}
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e, activeTab)}
                          className="file-input"
                        />
                        <label htmlFor={`images-${activeTab}`} className="upload-label">
                          <Upload size={24} />
                          <span>Click to upload images</span>
                          <small>Up to 5 images (JPG, PNG, WebP)</small>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {previewImages[activeTab] && previewImages[activeTab].length > 0 && (
                        <div className="image-previews">
                          {previewImages[activeTab].map((preview, index) => (
                            <div key={index} className="image-preview">
                              <img src={preview} alt={`Preview ${index + 1}`} />
                              <button
                                type="button"
                                className="remove-image"
                                onClick={() => removeImage(index, activeTab)}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="form-group">
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={
                      activeTab === 'gown' ? gownData.notes :
                      activeTab === 'trouser' ? trouserData.notes :
                      generalData.notes
                    }
                    onChange={
                      activeTab === 'gown' ? handleGownChange :
                      activeTab === 'trouser' ? handleTrouserChange :
                      handleGeneralChange
                    }
                    placeholder="Any specific requirements, preferences, or additional information..."
                    rows="4"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Measurements'}
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

export default Measurement;
