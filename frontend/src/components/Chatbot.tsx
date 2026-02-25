import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, X, Send, Calendar, CheckSquare, Coffee } from 'lucide-react';

const API_URL = '/api';

const Chatbot: React.FC = () => {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    type Message = { sender: 'user' | 'bot', text: string };

    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Hi there! I am your Employee Portal assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        const newUserMessage: Message = { sender: 'user', text };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const response = await axios.post(`${API_URL}/chat`, { message: text }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newBotMessage: Message = { sender: 'bot', text: response.data.reply };
            setMessages([...newMessages, newBotMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickAction = (action: string) => {
        let text = '';
        if (action === 'leave') text = 'How do I apply for leave?';
        if (action === 'meeting') text = 'How do I schedule a meeting?';
        if (action === 'tasks') text = 'Where are my tasks?';
        handleSend(text);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'var(--font-family)' }}>
            {isOpen ? (
                <div style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'var(--bg-color)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '15px 20px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '30px', height: '30px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <MessageSquare size={16} />
                            </div>
                            <span style={{ fontWeight: 600 }}>Portal Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '12px 16px',
                                borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : 'var(--secondary-color)',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                                fontSize: '0.95rem',
                                lineHeight: '1.4',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{
                                alignSelf: 'flex-start',
                                padding: '12px 16px',
                                borderRadius: '16px 16px 16px 0',
                                backgroundColor: 'var(--secondary-color)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                fontStyle: 'italic'
                            }}>
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length === 1 && (
                        <div style={{ padding: '0 20px 15px', display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                            <button onClick={() => handleQuickAction('leave')} style={{ padding: '8px 12px', borderRadius: '20px', border: '1px solid var(--primary-color)', backgroundColor: 'transparent', color: 'var(--primary-dark)', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}><Coffee size={14} /> Apply Leave</button>
                            <button onClick={() => handleQuickAction('meeting')} style={{ padding: '8px 12px', borderRadius: '20px', border: '1px solid var(--primary-color)', backgroundColor: 'transparent', color: 'var(--primary-dark)', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Schedule Meeting</button>
                            <button onClick={() => handleQuickAction('tasks')} style={{ padding: '8px 12px', borderRadius: '20px', border: '1px solid var(--primary-color)', backgroundColor: 'transparent', color: 'var(--primary-dark)', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckSquare size={14} /> My Tasks</button>
                        </div>
                    )}

                    {/* Input Area */}
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ padding: '15px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={{ flex: 1, padding: '10px 15px', borderRadius: '24px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                        />
                        <button type="submit" disabled={!input.trim()} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: input.trim() ? 'var(--primary-color)' : 'var(--border-color)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'background-color 0.2s' }}>
                            <Send size={18} style={{ marginLeft: '2px' }} />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageSquare size={28} />
                </button>
            )}
        </div>
    );
};

export default Chatbot;
