import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Save, Lock } from 'lucide-react';

const API_URL = '/api';

const Profile: React.FC = () => {
    const { user, token, updateUser } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        gender: '',
        street: '',
        city: '',
        district: '',
        town: '',
        state: '',
        country: '',
        department: '',
        position: '',
        avatar: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [pwdMessage, setPwdMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                gender: user.gender || '',
                street: user.street || '',
                city: user.city || '',
                district: user.district || '',
                town: user.town || '',
                state: user.state || '',
                country: user.country || 'India',
                department: user.department || '',
                position: user.position || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const response = await axios.put(`${API_URL}/users/profile`, profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUser(response.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setPwdMessage({ type: 'danger', text: 'New passwords do not match' });
        }

        try {
            await axios.put(`${API_URL}/auth/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPwdMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setPwdMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to change password' });
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">Manage your personal information and security settings.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem', fontWeight: 'bold', overflow: 'hidden'
                        }}>
                            {profileData.avatar ? (
                                <img src={profileData.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user?.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{user?.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{user?.email}</p>
                            <span className="badge badge-success">{user?.role}</span>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                        {message.text && (
                            <div className={`badge badge-${message.type}`} style={{ display: 'block', marginBottom: '15px', padding: '10px' }}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid-2" style={{ gap: '15px' }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" className="form-control" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Profile Photo</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input type="file" id="avatarUpload" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfileData({ ...profileData, avatar: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                    <label htmlFor="avatarUpload" className="btn btn-outline" style={{ cursor: 'pointer', padding: '8px 15px', display: 'inline-block', margin: 0 }}>
                                        Choose File
                                    </label>
                                    {profileData.avatar ? <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>Photo Present</span> : <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No file chosen</span>}
                                </div>
                            </div>
                        </div>

                        <div className="grid-2" style={{ gap: '15px' }}>
                            <div className="form-group">
                                <label>Department</label>
                                <input type="text" className="form-control" value={profileData.department} disabled style={{ backgroundColor: 'var(--secondary-color)' }} />
                            </div>
                            <div className="form-group">
                                <label>Position</label>
                                <input type="text" className="form-control" value={profileData.position} disabled style={{ backgroundColor: 'var(--secondary-color)' }} />
                            </div>
                        </div>

                        <div className="grid-2" style={{ gap: '15px' }}>
                            <div className="form-group">
                                <label>Gender</label>
                                <select className="form-control" value={profileData.gender} onChange={e => setProfileData({ ...profileData, gender: e.target.value })}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" className="form-control" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
                            </div>
                        </div>

                        <p style={{ fontWeight: 600, marginTop: '10px', marginBottom: '15px' }}>Address Details</p>

                        <div className="form-group">
                            <label>Street</label>
                            <input type="text" className="form-control" value={profileData.street} onChange={e => setProfileData({ ...profileData, street: e.target.value })} />
                        </div>

                        <div className="grid-2" style={{ gap: '15px' }}>
                            <div className="form-group">
                                <label>City/Village</label>
                                <input type="text" className="form-control" value={profileData.city} onChange={e => setProfileData({ ...profileData, city: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Town</label>
                                <input type="text" className="form-control" value={profileData.town} onChange={e => setProfileData({ ...profileData, town: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid-3" style={{ gap: '15px' }}>
                            <div className="form-group">
                                <label>District</label>
                                <input type="text" className="form-control" value={profileData.district} onChange={e => setProfileData({ ...profileData, district: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" className="form-control" value={profileData.state} onChange={e => setProfileData({ ...profileData, state: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input type="text" className="form-control" value={profileData.country} onChange={e => setProfileData({ ...profileData, country: e.target.value })} />
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', fontStyle: 'italic' }}>
                            "Your email and role are managed by your administrator..."
                        </p>

                        <button type="submit" className="btn btn-primary btn-solid">
                            <Save size={18} /> Save Changes
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={20} /> Security Settings
                    </h2>

                    <form onSubmit={handlePasswordSubmit}>
                        {pwdMessage.text && (
                            <div className={`badge badge-${pwdMessage.type}`} style={{ display: 'block', marginBottom: '15px', padding: '10px' }}>
                                {pwdMessage.text}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" className="form-control" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" className="form-control" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="Min 8 chars, 1 number, 1 special char" required />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" className="form-control" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                        </div>

                        <button type="submit" className="btn btn-outline" style={{ width: '100%' }}>
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
