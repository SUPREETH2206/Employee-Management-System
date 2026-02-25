import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Video, Calendar as CalendarIcon, Link, Plus, Mail } from 'lucide-react';

const API_URL = '/api';

const Meetings: React.FC = () => {
    const { user, token } = useAuth();
    const [meetings, setMeetings] = useState<any[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMeeting, setNewMeeting] = useState({ title: '', link: 'https://meet.google.com/new-meeting-id', scheduledTime: '', participants: '' });

    const predefinedLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;

    const fetchMeetingsInfo = async () => {
        try {
            const meetingRes = await axios.get(`${API_URL}/meetings`, { headers: { Authorization: `Bearer ${token}` } });
            setMeetings(meetingRes.data);

            const usersRes = await axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
            setUsersList(usersRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) fetchMeetingsInfo();
    }, [token]);

    const handleCreateMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/meetings`, newMeeting, { headers: { Authorization: `Bearer ${token}` } });
            setIsModalOpen(false);
            setNewMeeting({ title: '', link: predefinedLink, scheduledTime: '', participants: '' });
            fetchMeetingsInfo();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1 className="page-title">Meetings Space</h1>
                    <p className="page-subtitle">Virtual rooms and scheduled sync-ups.</p>
                </div>
                {user?.role === 'HR' && (
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Schedule Meeting
                    </button>
                )}
            </div>

            <div className="card" style={{ marginBottom: '30px', backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ backgroundColor: 'var(--white)', padding: '15px', borderRadius: '50%', color: 'var(--primary-color)' }}>
                            <Video size={36} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '5px' }}>Personal Meeting Room</h2>
                            <p style={{ color: 'var(--primary-dark)', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Link size={16} /> https://meet.company.portal/room/{user?.id.substring(0, 8)}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <select className="form-control" style={{ width: '200px', backgroundColor: 'var(--white)' }} value={selectedUserEmail} onChange={e => setSelectedUserEmail(e.target.value)}>
                            <option value="">Start meeting with...</option>
                            {usersList.filter(u => u.id !== user?.id).map(u => (
                                <option key={u.id} value={u.email}>{u.name} ({u.role})</option>
                            ))}
                        </select>
                        <button className="btn btn-outline" style={{ backgroundColor: 'var(--white)' }} onClick={() => {
                            const subject = encodeURIComponent("Immediate Sync-Up Request");
                            const body = encodeURIComponent(`Hi,\n\nPlease join my personal meeting room at your earliest convenience:\n\nJoin Link: https://meet.company.portal/room/${user?.id.substring(0, 8)}\n\nBest Regards,\n${user?.name}`);
                            window.location.href = `mailto:${selectedUserEmail}?subject=${subject}&body=${body}`;
                        }}>
                            <Mail size={18} /> Invite via Email
                        </button>
                        <button className="btn btn-primary btn-solid" onClick={() => {
                            if (selectedUserEmail) {
                                const subject = encodeURIComponent("Immediate Sync-Up Request");
                                const body = encodeURIComponent(`Hi,\n\nPlease join my personal meeting room now:\n\nJoin Link: https://meet.company.portal/room/${user?.id.substring(0, 8)}\n\nBest Regards,\n${user?.name}`);
                                window.location.href = `mailto:${selectedUserEmail}?subject=${subject}&body=${body}`;
                                setTimeout(() => window.open('https://meet.google.com/new', '_blank'), 500);
                            } else {
                                window.open('https://meet.google.com/new', '_blank');
                            }
                        }}>
                            <Video size={18} /> Start Meeting
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="page-title" style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Upcoming Meetings</h2>

            <div className="grid-3">
                {meetings.length === 0 ? (
                    <p>No upcoming meetings found.</p>
                ) : meetings.map((meeting: any) => (
                    <div key={meeting.id} className="card">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{meeting.title}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CalendarIcon size={16} />
                                <span>{new Date(meeting.scheduledTime).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Video size={16} />
                                <span>Host: {meeting.host?.name}</span>
                            </div>
                            {meeting.participants && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                    <Mail size={16} />
                                    <span>Invited: {meeting.participants}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <a href={`mailto:${meeting.participants}?subject=Invitation: ${meeting.title}&body=Hi,%0A%0AYou are invited to ${meeting.title}.%0A%0ATime: ${new Date(meeting.scheduledTime).toLocaleString()}%0AJoin Link: ${meeting.link}%0A%0ARegards,%0A${meeting.host?.name}`} className="btn btn-outline" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                                <Mail size={16} /> Email Invite
                            </a>
                            <a href={meeting.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-solid" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                                <Link size={16} /> Join Meeting
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                        <h2 style={{ marginBottom: '20px' }}>Schedule Meeting</h2>
                        <form onSubmit={handleCreateMeeting}>
                            <div className="form-group">
                                <label>Meeting Title</label>
                                <input type="text" className="form-control" required value={newMeeting.title} onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Meeting Link</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="url" className="form-control" required value={newMeeting.link} onChange={e => setNewMeeting({ ...newMeeting, link: e.target.value })} placeholder="https://meet.google.com/..." />
                                    <button type="button" className="btn btn-outline" onClick={() => setNewMeeting({ ...newMeeting, link: predefinedLink })}>Generate</button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Scheduled Time</label>
                                <input type="datetime-local" className="form-control" required value={newMeeting.scheduledTime} onChange={e => setNewMeeting({ ...newMeeting, scheduledTime: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Participants (Emails)</label>
                                <input type="text" className="form-control" value={newMeeting.participants} onChange={e => setNewMeeting({ ...newMeeting, participants: e.target.value })} placeholder="email1@domain.com, email2@domain.com" />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Meetings;
