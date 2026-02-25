import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Check, X } from 'lucide-react';

const API_URL = '/api';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!requirements.length && !requirements.uppercase && !requirements.lowercase && !requirements.number && !requirements.special) {
            // Keep validation rules active
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            const { token, user } = response.data;
            login(token, user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                        <div style={{
                            width: '48px', height: '48px',
                            backgroundColor: 'var(--primary-color)', color: 'var(--white)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '10px', fontSize: '32px', fontWeight: 'bold', marginRight: '6px'
                        }}>W</div>
                        <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>orkwise</span>
                    </div>
                    <p className="page-subtitle">Sign in to your account</p>
                </div>

                {error && (
                    <div className="badge badge-danger" style={{ display: 'block', marginBottom: '20px', textAlign: 'center', padding: '10px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: passwordFocused ? "10px" : "20px" }}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {passwordFocused && (
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                            <p style={{ fontWeight: 600, marginBottom: '10px' }}>Password Requirements:</p>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: requirements.length ? 'var(--success)' : 'var(--text-secondary)' }}>
                                    {requirements.length ? <Check size={16} /> : <X size={16} />} At least 8 characters long
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: requirements.uppercase ? 'var(--success)' : 'var(--text-secondary)' }}>
                                    {requirements.uppercase ? <Check size={16} /> : <X size={16} />} Contains an uppercase letter
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: requirements.lowercase ? 'var(--success)' : 'var(--text-secondary)' }}>
                                    {requirements.lowercase ? <Check size={16} /> : <X size={16} />} Contains a lowercase letter
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: requirements.number ? 'var(--success)' : 'var(--text-secondary)' }}>
                                    {requirements.number ? <Check size={16} /> : <X size={16} />} Contains a number
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: requirements.special ? 'var(--success)' : 'var(--text-secondary)' }}>
                                    {requirements.special ? <Check size={16} /> : <X size={16} />} Contains a special character
                                </li>
                            </ul>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : (
                            <>
                                <LogIn size={20} />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <p>Demo HR: hr@portal.com / Supreeth@123</p>
                    <p>Demo Emp: emp@portal.com / Supreeth@123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
