import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Ruler, Package, User, Lock } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [gownMeasurements, setGownMeasurements] = useState([]);
  const [trouserMeasurements, setTrouserMeasurements] = useState([]);
  const [generalMeasurements, setGeneralMeasurements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, count: appointments.length },
    { id: 'gown', label: 'Gown Measurements', icon: <Package size={20} />, count: gownMeasurements.length },
    { id: 'trouser', label: 'Trouser Measurements', icon: <User size={20} />, count: trouserMeasurements.length },
    { id: 'general', label: 'General Measurements', icon: <Ruler size={20} />, count: generalMeasurements.length }
  ];

  useEffect(() => {
    fetchAllData();
    // Check if already authenticated from sessionStorage
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    // Simple authentication (in production, this should be done on the backend)
    if (loginForm.username === 'reinetteadmin' && loginForm.password === 'ReinetteVogue2025!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'authenticated');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setLoginForm({ username: '', password: '' });
  };

  const handleLoginInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [appointmentsRes, gownRes, trouserRes, generalRes] = await Promise.all([
        fetch('http://localhost:5000/appointments'),
        fetch('http://localhost:5000/gown-measurements'),
        fetch('http://localhost:5000/trouser-measurements'),
        fetch('http://localhost:5000/general-measurements')
      ]);

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData.appointments || []);
      }

      if (gownRes.ok) {
        const gownData = await gownRes.json();
        setGownMeasurements(gownData.measurements || []);
      }

      if (trouserRes.ok) {
        const trouserData = await trouserRes.json();
        setTrouserMeasurements(trouserData.measurements || []);
      }

      if (generalRes.ok) {
        const generalData = await generalRes.json();
        setGeneralMeasurements(generalData.measurements || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    }
    
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAppointments = () => (
    <div className="data-table">
      <h3>All Appointments ({appointments.length})</h3>
      {appointments.length === 0 ? (
        <p className="no-data">No appointments found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.name}</td>
                  <td>
                    <a href={`mailto:${appointment.email}`} className="email-link">
                      {appointment.email}
                    </a>
                  </td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <span className={`status-badge ${appointment.appointmentType}`}>
                      {appointment.appointmentType}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>{formatDate(appointment.createdAt)}</td>
                  <td>{appointment.notes || 'No notes'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderGownMeasurements = () => (
    <div className="data-table">
      <h3>Gown Measurements ({gownMeasurements.length})</h3>
      {gownMeasurements.length === 0 ? (
        <p className="no-data">No gown measurements found.</p>
      ) : (
        <div className="measurements-grid">
          {gownMeasurements.map((measurement) => (
            <div key={measurement._id} className="measurement-card">
              <div className="measurement-header">
                <h4>{measurement.customerName}</h4>
                <a href={`mailto:${measurement.customerEmail}`} className="email-link">
                  {measurement.customerEmail}
                </a>
                <span className="measurement-date">{formatDate(measurement.createdAt)}</span>
              </div>
              <div className="measurement-details">
                <div className="measurement-row">
                  <span>Shoulder:</span> <span>{measurement.shoulder} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Bust:</span> <span>{measurement.bust} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Waist:</span> <span>{measurement.waist} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Hips:</span> <span>{measurement.hips} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Full Length:</span> <span>{measurement.fullLength} {measurement.measurementUnit}</span>
                </div>
                {measurement.estimatedDelivery && (
                  <div className="measurement-row">
                    <span>Delivery:</span> <span>{new Date(measurement.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                )}
                {measurement.notes && (
                  <div className="measurement-notes">
                    <strong>Notes:</strong> {measurement.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTrouserMeasurements = () => (
    <div className="data-table">
      <h3>Trouser Measurements ({trouserMeasurements.length})</h3>
      {trouserMeasurements.length === 0 ? (
        <p className="no-data">No trouser measurements found.</p>
      ) : (
        <div className="measurements-grid">
          {trouserMeasurements.map((measurement) => (
            <div key={measurement._id} className="measurement-card">
              <div className="measurement-header">
                <h4>{measurement.customerName}</h4>
                <a href={`mailto:${measurement.customerEmail}`} className="email-link">
                  {measurement.customerEmail}
                </a>
                <span className="measurement-date">{formatDate(measurement.createdAt)}</span>
              </div>
              <div className="measurement-details">
                <div className="measurement-row">
                  <span>Waist:</span> <span>{measurement.waist} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Hips:</span> <span>{measurement.hips} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Crotch:</span> <span>{measurement.crotch} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Length:</span> <span>{measurement.trouserLength} {measurement.measurementUnit}</span>
                </div>
                {measurement.estimatedDelivery && (
                  <div className="measurement-row">
                    <span>Delivery:</span> <span>{new Date(measurement.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                )}
                {measurement.notes && (
                  <div className="measurement-notes">
                    <strong>Notes:</strong> {measurement.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGeneralMeasurements = () => (
    <div className="data-table">
      <h3>General Measurements ({generalMeasurements.length})</h3>
      {generalMeasurements.length === 0 ? (
        <p className="no-data">No general measurements found.</p>
      ) : (
        <div className="measurements-grid">
          {generalMeasurements.map((measurement) => (
            <div key={measurement._id} className="measurement-card">
              <div className="measurement-header">
                <h4>{measurement.customerName}</h4>
                <a href={`mailto:${measurement.customerEmail}`} className="email-link">
                  {measurement.customerEmail}
                </a>
                <span className="measurement-date">{formatDate(measurement.createdAt)}</span>
              </div>
              <div className="measurement-details">
                <div className="measurement-row">
                  <span>Bust:</span> <span>{measurement.bust} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Waist:</span> <span>{measurement.waist} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Hips:</span> <span>{measurement.hips} {measurement.measurementUnit}</span>
                </div>
                <div className="measurement-row">
                  <span>Height:</span> <span>{measurement.height} {measurement.measurementUnit}</span>
                </div>
                {measurement.notes && (
                  <div className="measurement-notes">
                    <strong>Notes:</strong> {measurement.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      {!isAuthenticated ? (
        // Login Form
        <div className="admin-login">
          <div className="login-container">
            <motion.div 
              className="login-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="login-header">
                <Lock size={40} />
                <h2>Admin Access</h2>
                <p>Please enter your credentials to continue</p>
              </div>
              
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={loginForm.username}
                    onChange={handleLoginInputChange}
                    required
                    autoComplete="username"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginInputChange}
                    required
                    autoComplete="current-password"
                  />
                </div>
                
                {loginError && (
                  <div className="login-error">
                    {loginError}
                  </div>
                )}
                
                <button type="submit" className="login-btn">
                  Access Dashboard
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      ) : (
        // Dashboard Content
        <>
          <div className="dashboard-header">
            <div className="container">
              <motion.div 
                className="header-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="header-top">
                  <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage appointments and customer measurements</p>
                  </div>
                  <div className="header-actions">
                    <button onClick={fetchAllData} className="refresh-btn" disabled={loading}>
                      {loading ? 'Loading...' : 'Refresh Data'}
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

      <div className="dashboard-content section">
        <div className="container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="dashboard-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="tab-count">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="dashboard-content-area">
            {loading ? (
              <div className="loading">Loading data...</div>
            ) : (
              <>
                {activeTab === 'appointments' && renderAppointments()}
                {activeTab === 'gown' && renderGownMeasurements()}
                {activeTab === 'trouser' && renderTrouserMeasurements()}
                {activeTab === 'general' && renderGeneralMeasurements()}
              </>
            )}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default AdminDashboard;
