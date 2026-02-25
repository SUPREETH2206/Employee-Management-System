import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Briefcase, Calendar as CalendarIcon, Megaphone, TrendingUp, Clock, FileText, ArrowRight, Download } from 'lucide-react';

const API_URL = '/api';

const Dashboard: React.FC = () => {
    const { user, token } = useAuth();
    const [taskSummary, setTaskSummary] = useState({ to_do: 0, in_progress: 0, completed: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                const response = await axios.get(`${API_URL}/tasks`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const tasks = response.data;
                const summary = {
                    to_do: tasks.filter((t: any) => t.status === 'To Do').length,
                    in_progress: tasks.filter((t: any) => t.status === 'In Progress').length,
                    completed: tasks.filter((t: any) => t.status === 'Completed').length,
                };
                setTaskSummary(summary);
            } catch (err) {
                console.error('Failed to fetch tasks', err);
            }
        };
        fetchStats();
    }, [token]);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                <p className="page-subtitle">Here is what's happening today.</p>
            </div>

            <div className="grid-4" style={{ marginBottom: '30px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(56, 142, 60, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--success)' }}>
                        <Briefcase size={28} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{taskSummary.in_progress}</h3>
                        <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>Active Tasks</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(245, 124, 0, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--warning)' }}>
                        <Clock size={28} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{taskSummary.to_do}</h3>
                        <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>Pending Tasks</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--primary-color)' }}>
                        <CalendarIcon size={28} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>8</h3>
                        <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>Upcoming Meetings</p>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', padding: '15px', borderRadius: '12px', color: '#2196f3' }}>
                        <FileText size={28} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>12</h3>
                        <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>Documents</p>
                    </div>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 className="page-title" style={{ fontSize: '1.2rem', marginBottom: '0' }}>Company Growth Insights</h2>
                        <TrendingUp size={20} color="var(--primary-color)" />
                    </div>

                    <div style={{ height: '300px', width: '100%', position: 'relative', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', overflow: 'hidden' }}>
                        <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <defs>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f2fe" />
                                    <stop offset="50%" stopColor="#4facfe" />
                                    <stop offset="100%" stopColor="#f093fb" />
                                </linearGradient>
                                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4facfe" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#f093fb" stopOpacity="0" />
                                </linearGradient>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                </pattern>
                            </defs>

                            <rect width="600" height="200" fill="url(#grid)" />

                            {/* Beautiful Curved Area Chart */}
                            <path d="M0,180 C50,180 80,110 120,130 C160,150 190,60 240,90 C290,120 320,100 380,50 C440,0 500,140 540,110 C580,80 600,60 600,60 L600,200 L0,200 Z" fill="url(#fillGradient)" />

                            {/* Main Glowing Curved Line */}
                            <path d="M0,180 C50,180 80,110 120,130 C160,150 190,60 240,90 C290,120 320,100 380,50 C440,0 500,140 540,110 C580,80 600,60 600,60" fill="none" stroke="url(#neonGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

                            {/* Data points */}
                            {[
                                { x: 0, y: 180 }, { x: 120, y: 130 }, { x: 240, y: 90 }, { x: 380, y: 50 }, { x: 540, y: 110 }, { x: 600, y: 60 }
                            ].map((pt, i) => (
                                <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="#fff" filter="url(#glow)" />
                            ))}
                        </svg>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {user?.role === 'HR' && (
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <FileText size={20} color="var(--primary-color)" />
                                <h2 className="page-title" style={{ fontSize: '1.2rem', margin: '0' }}>Company Documents</h2>
                            </div>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                                    <span>Employee Handbook 2026.pdf</span>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}><Download size={16} /></button>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                                    <span>Leave Policy Guidelines.docx</span>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}><Download size={16} /></button>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Q1 Financial Report.xlsx</span>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}><Download size={16} /></button>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Megaphone size={20} color="var(--warning)" />
                            <h2 className="page-title" style={{ fontSize: '1.2rem', margin: '0' }}>Announcements</h2>
                        </div>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li style={{ padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                                <strong>Q3 Townhall Meeting</strong>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Scheduled for Friday, 10:00 AM. Attendance mandatory.</p>
                            </li>
                            <li style={{ padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                                <strong>New Health Benefits Policy</strong>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Check your email for the updated PDF handbook.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CalendarIcon size={20} color="var(--primary-color)" />
                                <h2 className="page-title" style={{ fontSize: '1.2rem', margin: '0' }}>Indian Holidays (2026)</h2>
                            </div>
                            <a href="/holidays" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center' }} title="View All Holidays">
                                <ArrowRight size={20} />
                            </a>
                        </div>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                                <span>New Year's Day</span>
                                <span className="badge badge-default">Jan 1</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                                <span>Republic Day</span>
                                <span className="badge badge-default">Jan 26</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                                <span>Holi</span>
                                <span className="badge badge-default">Mar 4</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                                <span>Ugadi</span>
                                <span className="badge badge-default">Mar 19</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                                <span>Independence Day</span>
                                <span className="badge badge-default">Aug 15</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Diwali</span>
                                <span className="badge badge-default">Nov 8</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
