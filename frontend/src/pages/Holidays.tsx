import React from 'react';

const Holidays: React.FC = () => {
    const allHolidays = [
        { date: 'Jan 1, 2026', day: 'Thursday', name: 'New Year\'s Day', type: 'Government Holiday' },
        { date: 'Jan 14, 2026', day: 'Wednesday', name: 'Makar Sankranti / Pongal', type: 'Festival' },
        { date: 'Jan 26, 2026', day: 'Monday', name: 'Republic Day', type: 'Government Holiday' },
        { date: 'Feb 15, 2026', day: 'Sunday', name: 'Maha Shivaratri', type: 'Festival' },
        { date: 'Mar 4, 2026', day: 'Wednesday', name: 'Holi', type: 'Festival' },
        { date: 'Mar 19, 2026', day: 'Thursday', name: 'Ugadi / Gudi Padwa', type: 'Festival' },
        { date: 'Mar 21, 2026', day: 'Saturday', name: 'Eid-ul-Fitr', type: 'Government Holiday' },
        { date: 'Mar 31, 2026', day: 'Tuesday', name: 'Mahavir Jayanti', type: 'Government Holiday' },
        { date: 'Apr 3, 2026', day: 'Friday', name: 'Good Friday', type: 'Government Holiday' },
        { date: 'May 1, 2026', day: 'Friday', name: 'Buddha Purnima', type: 'Government Holiday' },
        { date: 'May 27, 2026', day: 'Wednesday', name: 'Id-ul-Zuha (Bakrid)', type: 'Government Holiday' },
        { date: 'Jun 26, 2026', day: 'Friday', name: 'Muharram', type: 'Government Holiday' },
        { date: 'Aug 15, 2026', day: 'Saturday', name: 'Independence Day', type: 'Government Holiday' },
        { date: 'Aug 26, 2026', day: 'Wednesday', name: 'Janmashtami', type: 'Festival' },
        { date: 'Oct 2, 2026', day: 'Friday', name: 'Gandhi Jayanti', type: 'Government Holiday' },
        { date: 'Oct 18, 2026', day: 'Sunday', name: 'Dussehra', type: 'Festival' },
        { date: 'Nov 8, 2026', day: 'Sunday', name: 'Diwali', type: 'Festival' },
        { date: 'Dec 25, 2026', day: 'Friday', name: 'Christmas Day', type: 'Government Holiday' }
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Comprehensive Holidays List (2026)</h1>
                <p className="page-subtitle">View all major festivals, minor festivals, and government holidays.</p>
            </div>

            <div className="card table-responsive" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Festival / Holiday</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allHolidays.map((holiday, idx) => (
                            <tr key={idx}>
                                <td>{holiday.date}</td>
                                <td>{holiday.day}</td>
                                <td style={{ fontWeight: 500 }}>{holiday.name}</td>
                                <td>
                                    <span className={`badge ${holiday.type === 'Government Holiday' ? 'badge-primary' : holiday.type === 'Festival' ? 'badge-warning' : 'badge-default'}`}>
                                        {holiday.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Holidays;
