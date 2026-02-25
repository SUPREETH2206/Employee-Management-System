import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="page-container">
            <Sidebar />
            <div className="main-content-wrapper" style={{ position: 'relative' }}>
                <ThemeToggle />
                <main className="main-content">
                    <Outlet />
                </main>
                <Footer />
                <Chatbot />
            </div>
        </div>
    );
};

export default Layout;
