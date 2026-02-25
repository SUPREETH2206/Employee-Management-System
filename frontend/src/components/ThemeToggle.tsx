import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('portal-theme') || 'theme-light');

    useEffect(() => {
        // Toggle dark theme class
        if (theme === 'theme-dark') {
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.remove('theme-dark');
        }
        localStorage.setItem('portal-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light');
    };

    return (
        <div style={{ position: 'absolute', top: '20px', right: '40px', zIndex: 50 }}>
            <button
                className="btn btn-outline"
                onClick={toggleTheme}
                style={{ background: 'var(--panel-bg)', padding: '8px 12px', borderColor: 'var(--border-color)', color: 'var(--primary-color)', borderRadius: '20px' }}
            >
                {theme === 'theme-dark' ? (
                    <><Sun size={18} /> Light</>
                ) : (
                    <><Moon size={18} /> Dark</>
                )}
            </button>
        </div>
    );
};

export default ThemeToggle;
