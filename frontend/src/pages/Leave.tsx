import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus } from 'lucide-react';

const API_URL = '/api';

const Leave: React.FC = () => {
    const { user, token } = useAuth();
    const [leaves, setLeaves] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLeave, setNewLeave] = useState({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`${API_URL}/leaves`, { headers: { Authorization: `Bearer ${token}` } });
            setLeaves(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchLeaves();
    }, [token]);

    const handleCreateLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/leaves`, newLeave, { headers: { Authorization: `Bearer ${token}` } });
            setIsModalOpen(false);
            setNewLeave({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await axios.put(`${API_URL}/leaves/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            fetchLeaves();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1 className="page-title">Leave Management</h1>
                    <p className="page-subtitle">Request time off and view your leave history.</p>
                </div>
                {user?.role === 'EMPLOYEE' && (
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Request Leave
                    </button>
                )}
            </div>

            <div className="card table-responsive" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="table">
                    <thead>
                        <tr>
                            {user?.role === 'HR' && <th>Employee</th>}
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Duration</th>
                            <th>Reason</th>
                            <th>StatusBadge</th>
                            {user?.role === 'HR' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={user?.role === 'HR' ? 7 : 5} style={{ textAlign: 'center', padding: '30px' }}>
                                    No leave requests found.
                                </td>
                            </tr>
                        ) : leaves.map((leave: any) => (
                            <tr key={leave.id}>
                                {user?.role === 'HR' && <td style={{ fontWeight: 500 }}>{leave.user?.name}</td>}
                                <td>{leave.type}</td>
                                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td>{leave.durationDays} days</td>
                                <td>{leave.reason}</td>
                                <td>
                                    <span className={`badge ${leave.status === 'Approved' ? 'badge-success' : leave.status === 'Declined' ? 'badge-danger' : 'badge-warning'}`}>
                                        {leave.status}
                                    </span>
                                </td>
                                {user?.role === 'HR' && (
                                    <td>
                                        {leave.status === 'Pending' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="badge badge-success" style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleStatusUpdate(leave.id, 'Approved')}>Approve</button>
                                                <button className="badge badge-danger" style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleStatusUpdate(leave.id, 'Declined')}>Decline</button>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Processed</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                        <h2 style={{ marginBottom: '20px' }}>Request Time Off</h2>
                        <form onSubmit={handleCreateLeave}>
                            <div className="form-group">
                                <label>Leave Type</label>
                                <select className="form-control" required value={newLeave.type} onChange={e => setNewLeave({ ...newLeave, type: e.target.value })}>
                                    <option value="Paid Leave">Paid Leave</option>
                                    <option value="Unpaid Leave">Unpaid Leave</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                </select>
                            </div>
                            <div className="grid-2" style={{ gap: '15px' }}>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input type="date" className="form-control" required value={newLeave.startDate} onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input type="date" className="form-control" required min={newLeave.startDate} value={newLeave.endDate} onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })} />
                                </div>
                            </div>
                            {newLeave.startDate && newLeave.endDate && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                    Duration: <strong>{Math.ceil(Math.abs(new Date(newLeave.endDate).getTime() - new Date(newLeave.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}</strong> days
                                </p>
                            )}
                            <div className="form-group">
                                <label>Reason</label>
                                <textarea className="form-control" required value={newLeave.reason} onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leave;
