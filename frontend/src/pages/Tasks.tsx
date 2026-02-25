import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus } from 'lucide-react';

const API_URL = '/api';

const Tasks: React.FC = () => {
    const { user, token } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', userId: '' });

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
            setTasks(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEmployees = async () => {
        try {
            if (user?.role === 'HR') {
                const response = await axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
                setEmployees(response.data.filter((u: any) => u.role === 'EMPLOYEE'));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTasks();
            fetchEmployees();
        }
    }, [token, user]);

    const handleStatusUpdate = async (taskId: string, newStatus: string) => {
        try {
            await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/tasks`, {
                ...newTask,
                assignedBy: user?.name
            }, { headers: { Authorization: `Bearer ${token}` } });
            setIsModalOpen(false);
            setNewTask({ title: '', description: '', dueDate: '', userId: '' });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1 className="page-title">{user?.role === 'HR' ? 'Task Progress' : 'Task Management'}</h1>
                    <p className="page-subtitle">{user?.role === 'HR' ? 'Assign new work and track employee progress.' : 'Manage your tasks and keep track of progress.'}</p>
                </div>
                {user?.role === 'HR' && (
                    <button className="btn btn-primary btn-solid" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Create Task
                    </button>
                )}
            </div>

            <div className="grid-3">
                {tasks.map((task: any) => (
                    <div key={task.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{task.title}</h3>
                            <span className={`badge ${task.status === 'Completed' ? 'badge-success' : task.status === 'In Progress' ? 'badge-warning' : 'badge-default'}`}>
                                {task.status}
                            </span>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', flex: 1 }}>
                            {task.description}
                        </p>

                        <div style={{ backgroundColor: 'var(--bg-color)', padding: '15px', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Assigned by</span>
                                <span style={{ fontWeight: 500 }}>{task.assignedBy}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Due date</span>
                                <span style={{ fontWeight: 500 }}>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>

                            {user?.role === 'HR' && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Employee</span>
                                    <span style={{ fontWeight: 500 }}>{task.user?.name}</span>
                                </div>
                            )}
                        </div>

                        {user?.role === 'HR' ? (
                            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Progress:</span>
                                <span style={{ fontWeight: 600, color: task.status === 'Completed' ? 'var(--success)' : task.status === 'In Progress' ? 'var(--warning)' : 'var(--text-primary)' }}>{task.status}</span>
                            </div>
                        ) : (
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <select
                                    className="form-control"
                                    value={task.status}
                                    onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                                    style={{ cursor: 'pointer', padding: '10px', flex: 1, border: '1px solid var(--primary-color)', color: 'var(--primary-dark)' }}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {
                isModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                        <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                            <h2 style={{ marginBottom: '20px' }}>Create New Task</h2>
                            <form onSubmit={handleCreateTask}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input type="text" className="form-control" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-control" required value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Assign To (Employee)</label>
                                    <select className="form-control" required value={newTask.userId} onChange={e => setNewTask({ ...newTask, userId: e.target.value })}>
                                        <option value="">Select an employee</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Due Date</label>
                                    <input type="date" className="form-control" required value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Tasks;
