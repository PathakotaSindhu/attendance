import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            // Redirect if not an admin
            navigate('/qr-scanner');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header Section */}
            <div className="flex items-center bg-blue-800 text-white p-4 shadow-md">
                <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <img src="/path/to/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-2xl font-bold">Apteknow Careers</h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex space-x-4">
                        <Link to="/admin-dashboard" className="px-4 py-2 rounded-md hover:bg-blue-700">Dashboard</Link>
                        <Link to="/admin/profile" className="px-4 py-2 rounded-md hover:bg-blue-700">Admin Profile</Link>
                        <Link to="/admin/manage-users" className="px-4 py-2 rounded-md hover:bg-blue-700">Manage Users</Link>
                        <Link to="/admin/view-attendance" className="px-4 py-2 rounded-md hover:bg-blue-700">View Attendance</Link>
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="flex flex-grow w-full max-w-6xl mx-auto mt-8">
                {/* Sidebar */}
                <div className="w-1/4 bg-white shadow-lg rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Options</h2>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/admin/view-attendance" className="block bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700">
                                View Attendance
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/manage-users" className="block bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700">
                                Manage Users
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Main Dashboard Content */}
                <div className="flex-grow bg-white shadow-lg rounded-lg p-6 ml-4">
                    <h2 className="text-3xl font-bold mb-6">Welcome, Admin!</h2>
                    <p className="text-gray-600">Apteknow Careers' admin dashboard allows you to manage users, view attendance records, and update your profile.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
