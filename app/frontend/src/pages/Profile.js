import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, updateUserProfile, authAxios, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    company_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    preferred_currency: 'INR',
    notification_preferences: {
      email: true,
      sms: false,
      push: true
    }
  });
  
  // Password change form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // Activity log mock data
  const [activityLog] = useState([
    { id: 1, action: 'Login', timestamp: '2025-04-20T09:30:00Z', ip: '192.168.1.1', device: 'Chrome / Windows' },
    { id: 2, action: 'Price Alert Created', timestamp: '2025-04-19T14:45:00Z', ip: '192.168.1.1', device: 'Chrome / Windows' },
    { id: 3, action: 'Profile Updated', timestamp: '2025-04-18T11:20:00Z', ip: '192.168.1.1', device: 'Chrome / Windows' },
    { id: 4, action: 'Login', timestamp: '2025-04-18T11:15:00Z', ip: '192.168.1.1', device: 'Chrome / Windows' }
  ]);

  // Load user data on component mount
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        ...profileData,
        username: currentUser.username || '',
        email: currentUser.email || '',
        company_name: currentUser.company_name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        postal_code: currentUser.postal_code || '',
        country: currentUser.country || 'India',
        preferred_currency: currentUser.preferred_currency || 'INR',
        notification_preferences: currentUser.notification_preferences || {
          email: true,
          sms: false,
          push: true
        }
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('notification_')) {
      const notificationType = name.replace('notification_', '');
      setProfileData(prev => ({
        ...prev,
        notification_preferences: {
          ...prev.notification_preferences,
          [notificationType]: checked
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // await updateUserProfile(profileData);
      
      // Simulate API delay
      setTimeout(() => {
        setSuccessMessage('Profile updated successfully!');
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again later.');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // await authAxios.post('/auth/change-password', {
      //   current_password: passwordData.current_password,
      //   new_password: passwordData.new_password
      // });
      
      // Simulate API delay
      setTimeout(() => {
        setSuccessMessage('Password changed successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please check your current password and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <header className="page-header">
        <h1>Your Profile</h1>
        <p>Manage your account settings and preferences</p>
      </header>

      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} duration={5000} />}

      <div className="profile-content">
        <div className="profile-main">
          <Card title="Account Information" className="profile-card">
            <form onSubmit={handleProfileSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value={profileData.username} 
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={profileData.email} 
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company_name">Company Name</label>
                  <input 
                    type="text" 
                    id="company_name" 
                    name="company_name" 
                    value={profileData.company_name} 
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  value={profileData.address} 
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={profileData.city} 
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input 
                    type="text" 
                    id="state" 
                    name="state" 
                    value={profileData.state} 
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postal_code">Postal Code</label>
                  <input 
                    type="text" 
                    id="postal_code" 
                    name="postal_code" 
                    value={profileData.postal_code} 
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select 
                    id="country" 
                    name="country" 
                    value={profileData.country} 
                    onChange={handleProfileChange}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="UAE">UAE</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="preferred_currency">Preferred Currency</label>
                <select 
                  id="preferred_currency" 
                  name="preferred_currency" 
                  value={profileData.preferred_currency} 
                  onChange={handleProfileChange}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div className="form-actions">
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Change Password" className="password-card">
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="current_password">Current Password</label>
                <input 
                  type="password" 
                  id="current_password" 
                  name="current_password" 
                  value={passwordData.current_password} 
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new_password">New Password</label>
                <input 
                  type="password" 
                  id="new_password" 
                  name="new_password" 
                  value={passwordData.new_password} 
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirm_password" 
                  name="confirm_password" 
                  value={passwordData.confirm_password} 
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>

              <div className="form-actions">
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loading}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="profile-sidebar">
          <Card title="Notification Preferences" className="notifications-card">
            <div className="notification-options">
              <div className="notification-option">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="notification_email" 
                    checked={profileData.notification_preferences.email} 
                    onChange={handleProfileChange}
                  />
                  <span>Email Notifications</span>
                </label>
                <p className="notification-description">Receive price alerts and account updates via email</p>
              </div>

              <div className="notification-option">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="notification_sms" 
                    checked={profileData.notification_preferences.sms} 
                    onChange={handleProfileChange}
                  />
                  <span>SMS Notifications</span>
                </label>
                <p className="notification-description">Receive urgent alerts via SMS</p>
              </div>

              <div className="notification-option">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="notification_push" 
                    checked={profileData.notification_preferences.push} 
                    onChange={handleProfileChange}
                  />
                  <span>Push Notifications</span>
                </label>
                <p className="notification-description">Receive notifications in your browser</p>
              </div>
            </div>
          </Card>

          <Card title="Recent Activity" className="activity-card">
            <div className="activity-log">
              {activityLog.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon"></div>
                  <div className="activity-details">
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-meta">
                      <span className="activity-time">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                      <span className="activity-device">{activity.device}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="account-actions-card">
            <div className="account-actions">
              <Button variant="secondary" fullWidth>Export My Data</Button>
              <Button 
                variant="danger" 
                fullWidth
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out?')) {
                    logout();
                  }
                }}
              >
                Log Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
