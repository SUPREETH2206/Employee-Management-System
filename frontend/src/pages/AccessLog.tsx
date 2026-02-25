import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = '/api';

const AccessLog: React.FC = () => {
    const { token, user } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${API_URL}/access-logs`, { headers: { Authorization: `Bearer ${token}` } });
                setLogs(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (token) fetchLogs();
    }, [token]);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Access Logs</h1>
                <p className="page-subtitle">Login and logout history records.</p>
            </div>

            <div className="card table-responsive" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="table">
                    <thead>
                        <tr>
                            {user?.role === 'HR' && <th>Employee Name</th>}
                            {user?.role === 'HR' && <th>Role</th>}
                            <th>Login Time</th>
                            <th>Logout Time</th>
                            <th>Session Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={user?.role === 'HR' ? 5 : 3} style={{ textAlign: 'center', padding: '30px' }}>
                                    No access logs found.
                                </td>
                            </tr>
                        ) : logs.map((log: any) => {
                            const loginDate = new Date(log.loginTime);
                            const logoutDate = log.logoutTime ? new Date(log.logoutTime) : null;

                            let duration = 'Active';
                            if (logoutDate) {
                                const diffInMs = logoutDate.getTime() - loginDate.getTime();
                                const diffMins = Math.round(diffInMs / 60000);
                                const hours = Math.floor(diffMins / 60);
                                const mins = diffMins % 60;
                                duration = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
                            }

                            return (
                                <tr key={log.id}>
                                    {user?.role === 'HR' && <td style={{ fontWeight: 500 }}>{log.user?.name}</td>}
                                    {user?.role === 'HR' && <td><span className="badge badge-default">{log.user?.role}</span></td>}
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{loginDate.toLocaleDateString()}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{loginDate.toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {logoutDate ? (
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{logoutDate.toLocaleDateString()}</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{logoutDate.toLocaleTimeString()}</span>
                                            </div>
                                        ) : (
                                            <span className="badge badge-success">Currently Active</span>
                                        )}
                                    </td>
                                    <td>{duration}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccessLog;
