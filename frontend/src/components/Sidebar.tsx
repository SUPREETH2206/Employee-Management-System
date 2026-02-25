import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    UserCircle,
    CheckSquare,
    Video,
    Calendar,
    Clock,
    LogOut
} from 'lucide-react';
import axios from 'axios';

const API_URL = '/api';

const Sidebar: React.FC = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (token) {
                await axios.post(`${API_URL}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div style={{
                    width: '32px', height: '32px',
                    backgroundColor: 'var(--white)', color: 'var(--primary-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px', fontSize: '22px', fontWeight: 'bold', marginRight: '4px'
                }}>W</div>
                <span>orkwise</span>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <UserCircle size={20} />
                            <span>Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <CheckSquare size={20} />
                            <span>Tasks</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/meetings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Video size={20} />
                            <span>Meetings</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/leave" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Calendar size={20} />
                            <span>Leave</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/access-log" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Clock size={20} />
                            <span>Access Log</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-card">
                    <div className="user-avatar" style={{ overflow: 'hidden' }}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            user?.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user?.name}</div>
                        <div className="user-role">{user?.role}</div>
                    </div>
                </div>
                <button className="btn btn-logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside >
    );
};

export default Sidebar;
