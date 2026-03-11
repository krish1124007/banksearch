import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { BACKENDDOMAIN } from '../../const/backenddomain';
import { Mic, Send, Bot, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const SuperSearch = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSpeech = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMessage = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        const currentQuery = query;
        setQuery('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${BACKENDDOMAIN}/api/v1/bank/supersearch`, {
                query: currentQuery
            });

            if (response.data.data.success) {
                const aiMessage = { role: 'bot', content: response.data.data.answer };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I couldn\'t process that request.' }]);
            }
        } catch (error) {
            console.error("Search Error:", error);
            setMessages(prev => [...prev, { role: 'bot', content: 'Connection error. Please check if the AI service is configured.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#f9fafb]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Bank Super Search
                        </h1>
                    </div>
                </div>
                <div className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">
                    AI agent Powered by Tankar Solutions 
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-80">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-50 border border-gray-100 text-center max-w-md">
                            <Bot className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">How can I help you today?</h2>
                            <p className="text-gray-500">
                                Ask about ROI, LTV, Policies, or find the best bank for your specific profile.
                            </p>
                            <div className="grid grid-cols-1 gap-2 mt-6">
                                <button onClick={() => setQuery("Which bank gives best Home Loan ROI for salaried?")} className="text-sm text-left p-2 hover:bg-blue-50 rounded-lg border border-gray-100 transition-colors">
                                    "Best Home Loan ROI for salaried?"
                                </button>
                                <button onClick={() => setQuery("Show banks with high LTV for self employed")} className="text-sm text-left p-2 hover:bg-blue-50 rounded-lg border border-gray-100 transition-colors">
                                    "High LTV for self employed?"
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] sm:max-w-[70%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md ${
                                    msg.role === 'user' ? 'bg-indigo-600' : 'bg-white border border-gray-100'
                                }`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-600" />}
                                </div>
                                <div className={`p-4 sm:p-5 rounded-2xl shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none prose prose-blue prose-sm sm:prose-base'
                                }`}>
                                    {msg.role === 'bot' ? (
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex max-w-[70%] space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center shadow-sm">
                                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-2xl rounded-tl-none">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 sm:p-6 shadow-lg shadow-black/5">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center space-x-3">
                    <button 
                        type="button" 
                        onClick={handleSpeech}
                        className={`p-3 sm:p-4 rounded-2xl transition-all duration-300 border ${
                            isListening 
                            ? 'bg-red-50 border-red-200 text-red-500 animate-pulse scale-110 shadow-lg shadow-red-100' 
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <Mic className={`w-5 h-5 sm:w-6 sm:h-6 ${isListening ? 'fill-current' : ''}`} />
                    </button>
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Ask me anything about banks..."}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-3 sm:py-4 pr-12 text-sm sm:text-base transition-all outline-none shadow-inner"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className={`p-3 sm:p-4 bg-blue-600 text-white rounded-2xl transition-all duration-300 shadow-lg ${
                            !query.trim() || isLoading 
                            ? 'opacity-50 cursor-not-allowed grayscale' 
                            : 'hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-200'
                        }`}
                    >
                        <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </form>
                <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-4">
                    The AI Agent analyzes bank policies in real-time. Matches are based on current database state.
                </p>
            </div>
        </div>
    );
};

export default SuperSearch;
