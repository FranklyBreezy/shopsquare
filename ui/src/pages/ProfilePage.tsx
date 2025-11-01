import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section, Grid } from '../components/Layout';
import { Button, Card, Input, LoadingSpinner } from '../components/UI';
import { api, Profile, User } from '../services/apiClient';
import { useUser } from '../state/UserContext';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    avatar: ''
  });
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await api.profiles.getByUserId(user.id);
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zipCode: profileData.zipCode || '',
        country: profileData.country || '',
        avatar: profileData.avatar || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      // Profile might not exist yet, that's okay
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      if (profile) {
        // Update existing profile
        const updatedProfile = await api.profiles.update(profile.id, formData);
        setProfile(updatedProfile);
      } else {
        // Create new profile
        const newProfile = await api.profiles.create({
          userId: user.id,
          ...formData
        });
        setProfile(newProfile);
      }
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || '',
        country: profile.country || '',
        avatar: profile.avatar || ''
      });
    }
    setEditing(false);
  };

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Section padding="lg">
        <Container size="lg">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <p>Loading profile...</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <Container size="lg">
        <div className="profile-page">
          <div className="page-header">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">
              Manage your personal information and preferences
            </p>
          </div>

          <div className="profile-content">
            {/* Profile Header */}
            <Card className="profile-header-card">
              <div className="profile-header">
                <div className="avatar-section">
                  <div className="avatar">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        <span>{user?.name?.charAt(0) || 'U'}</span>
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <h2 className="user-name">{user?.name}</h2>
                    <p className="user-email">{user?.email}</p>
                    <div className="user-role">
                      <span className={`role-badge role-${user?.role?.toLowerCase()}`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="profile-actions">
                  {editing ? (
                    <div className="edit-actions">
                      <Button
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        loading={saving}
                      >
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Profile Details */}
            <div className="profile-details">
              <Grid cols={2} gap="lg">
                {/* Personal Information */}
                <Card className="details-card">
                  <h3 className="card-title">Personal Information</h3>
                  <div className="form-fields">
                    <div className="field-row">
                      <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        disabled={!editing}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        disabled={!editing}
                        required
                      />
                    </div>
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      disabled={!editing}
                      placeholder="Enter your phone number"
                    />
                    <Input
                      label="Avatar URL"
                      value={formData.avatar}
                      onChange={handleInputChange('avatar')}
                      disabled={!editing}
                      placeholder="Enter avatar image URL"
                    />
                  </div>
                </Card>

                {/* Address Information */}
                <Card className="details-card">
                  <h3 className="card-title">Address Information</h3>
                  <div className="form-fields">
                    <Input
                      label="Street Address"
                      value={formData.address}
                      onChange={handleInputChange('address')}
                      disabled={!editing}
                      placeholder="Enter your street address"
                    />
                    <div className="field-row">
                      <Input
                        label="City"
                        value={formData.city}
                        onChange={handleInputChange('city')}
                        disabled={!editing}
                        placeholder="Enter your city"
                      />
                      <Input
                        label="State"
                        value={formData.state}
                        onChange={handleInputChange('state')}
                        disabled={!editing}
                        placeholder="Enter your state"
                      />
                    </div>
                    <div className="field-row">
                      <Input
                        label="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleInputChange('zipCode')}
                        disabled={!editing}
                        placeholder="Enter your ZIP code"
                      />
                      <Input
                        label="Country"
                        value={formData.country}
                        onChange={handleInputChange('country')}
                        disabled={!editing}
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>
                </Card>
              </Grid>
            </div>

            {/* Account Actions */}
            <Card className="account-actions-card">
              <h3 className="card-title">Account Actions</h3>
              <div className="actions-grid">
                <div className="action-item">
                  <h4>Order History</h4>
                  <p>View and track your past orders</p>
                  <Link to="/orders">
                    <Button variant="secondary" size="sm">
                      View Orders
                    </Button>
                  </Link>
                </div>
                {user?.role !== 'SELLER' && (
                  <div className="action-item">
                    <h4>Shopping Cart</h4>
                    <p>Manage items in your cart</p>
                    <Link to="/cart">
                      <Button variant="secondary" size="sm">
                        View Cart
                      </Button>
                    </Link>
                  </div>
                )}
                <div className="action-item">
                  <h4>Change Password</h4>
                  <p>Update your account password</p>
                  <Button variant="secondary" size="sm">
                    Change Password
                  </Button>
                </div>
                {user?.role === 'SELLER' && (
                  <div className="action-item">
                    <h4>Vendor Dashboard</h4>
                    <p>Manage your shop and products</p>
                    <Link to="/vendor-dashboard">
                      <Button variant="secondary" size="sm">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .profile-page {
          width: 100%;
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .page-title {
          font-size: var(--font-size-3xl);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .page-subtitle {
          color: var(--subtext-gray);
          font-size: var(--font-size-lg);
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .profile-header-card {
          padding: var(--spacing-xl);
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          background-color: var(--hover-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-3xl);
          font-weight: 600;
          color: var(--primary-orange);
          background-color: var(--hover-bg);
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--text-white);
        }

        .user-email {
          color: var(--subtext-gray);
          font-size: var(--font-size-base);
          margin-bottom: var(--spacing-sm);
        }

        .user-role {
          margin-bottom: var(--spacing-sm);
        }

        .role-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .role-user {
          background-color: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .role-vendor {
          background-color: rgba(255, 61, 0, 0.2);
          color: var(--primary-orange);
        }

        .role-admin {
          background-color: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
        }

        .profile-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .edit-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .details-card {
          padding: var(--spacing-lg);
        }

        .card-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--text-white);
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .account-actions-card {
          padding: var(--spacing-lg);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }

        .action-item {
          padding: var(--spacing-lg);
          background-color: var(--hover-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-gray);
        }

        .action-item h4 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .action-item p {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-md);
          line-height: 1.4;
        }

        .loading-container {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-container p {
          margin-top: var(--spacing-md);
          color: var(--subtext-gray);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .profile-header {
            flex-direction: column;
            gap: var(--spacing-lg);
            text-align: center;
          }

          .avatar-section {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: var(--font-size-2xl);
          }

          .page-subtitle {
            font-size: var(--font-size-base);
          }

          .profile-header-card {
            padding: var(--spacing-lg);
          }

          .avatar {
            width: 80px;
            height: 80px;
          }

          .user-name {
            font-size: var(--font-size-xl);
          }

          .field-row {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .edit-actions {
            flex-direction: column;
            width: 100%;
          }

          .edit-actions .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .profile-header-card {
            padding: var(--spacing-md);
          }

          .avatar {
            width: 60px;
            height: 60px;
          }

          .avatar-placeholder {
            font-size: var(--font-size-xl);
          }

          .user-name {
            font-size: var(--font-size-lg);
          }
        }
      `}</style>
    </Section>
  );
};
