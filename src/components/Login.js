import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loginResponse, setLoginResponse] = useState(null);

    // Update currentRole whenever loginResponse changes
    useEffect(() => {
        if (loginResponse) {
            console.log("Role from backend:", loginResponse.role);
            console.log("Role comparison:", loginResponse.role === 'ADMIN');

            // Navigate based on role
            if (loginResponse.role.toUpperCase() === 'ADMIN') {
                navigate('/admin-dashboard');
            } else {
                navigate('/qr-scanner');
            }
        }
    }, [loginResponse, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', { email, password });
            const data = response.data;

            // Save token, user ID, and role to local storage
            const token = data.token.split(' ')[1];
            localStorage.setItem('token', token);
            localStorage.setItem('id', data.id);
            localStorage.setItem('role', data.role);

            console.log("User ID:", data.id);
            console.log("Token:", token);
            console.log("Role:", data.role);

            // Set login response in state
            setLoginResponse(data);
        } catch (err) {
            console.error("Login error:", err);
            setError('Invalid login credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100">
            <div className="bg-white shadow-lg rounded-3xl p-8 max-w-sm w-full text-center transform transition-all duration-500 hover:scale-105">
                <h2 className="text-3xl font-extrabold text-gray-700 mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-left text-gray-600 font-medium">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        />
                    </div>
                    <div>
                        <label className="block text-left text-gray-600 font-medium">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:bg-blue-600 transition duration-300 transform hover:-translate-y-1"
                    >
                        Login
                    </button>
                    {error && (
                        <p className="text-center text-red-500 mt-3 font-medium">
                            {error}
                        </p>
                    )}
                </form>
                <p className="text-gray-500 mt-6 text-sm">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a></p>
            </div>
        </div>
    );
};

export default Login;
