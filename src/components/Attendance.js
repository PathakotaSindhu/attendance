import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';

const Attendance = () => {
    const navigate = useNavigate();
    const [attendanceType, setAttendanceType] = useState('');
    const [remarks, setRemarks] = useState('');
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies(['hasMarkedLogin']);
    const [showPopup, setShowPopup] = useState(false);  // Popup visibility state

    const handleAttendance = async () => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const instituteId = 1; // Replace with the actual institute ID or get it from user session/cookies

        if (!token) {
            alert('Please log in again.');
            navigate('/login');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const isTokenExpired = decodedToken.exp * 1000 < Date.now();
            if (isTokenExpired) {
                console.log('Token expired, redirecting to login');
                alert('Session expired. Please log in again.');
                navigate('/login');
                return;
            }
        } catch (error) {
            console.error('Invalid token:', error);
            alert('Invalid session. Please log in again.');
            navigate('/login');
            return;
        }

        const payload = {
            loginOption: attendanceType,
            user: { id: id },
            instituteId: instituteId, // Pass instituteId instead of instituteName
            remarks: attendanceType === 'logout' ? remarks : null, // Add remarks for logout
        };
        console.log('Payload:', payload);
        try {
            const response = await axios.post(
                'http://localhost:8080/api/attendance/add',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Response from server:', response);

            if (response.data && response.data.message) {
                setMessage(response.data.message);
            } else {
                setMessage('Attendance marked successfully.');
            }

            // Show the popup for 3 seconds before navigating
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);

                // Only navigate to QR scanner for login, not logout
                if (attendanceType === 'login') {
                    navigate('/success'); // Redirect to Success page after login
                } else if (attendanceType === 'logout') {
                    // For logout, navigate to the QR Code scanner page after the popup disappears
                    navigate('/qr-scanner');
                }
            }, 3000);  // Popup visible for 3 seconds
        } catch (error) {
            console.log(error.response);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please log in again.');
                navigate('/login');
            } else {
                setMessage('Attendance marking failed: ' + (error.response?.data.message || error.message));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-teal-100 via-teal-50 to-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">Mark Attendance</h2>

                {/* Show only the login/logout button, no dropdown */}
                {attendanceType === '' && (
                    <div className="mb-5">
                        <button
                            onClick={() => setAttendanceType('login')}
                            className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 mb-2"
                        >
                            Mark Login
                        </button>
                        <button
                            onClick={() => setAttendanceType('logout')}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                        >
                            Mark Logout
                        </button>
                    </div>
                )}

                {attendanceType === 'logout' && (
                    <div className="mt-4">
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Enter your remarks"
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        <button
                            onClick={handleAttendance}
                            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                        >
                            Submit Remarks
                        </button>
                    </div>
                )}

                {attendanceType === 'login' && (
                    <button
                        onClick={handleAttendance}
                        className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
                    >
                        Mark Login
                    </button>
                )}

                {message && (
                    <p className="mt-4 text-center text-teal-600 font-semibold">
                        {message}
                    </p>
                )}
            </div>

            {/* Show the popup message if attendance is marked successfully */}
            {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-teal-700">
                            {attendanceType === 'login' ? 'Successfully Logged In!' : 'Successfully Logged Out!'}
                        </h3>
                        <p className="text-teal-600 mt-2">You will be redirected shortly.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
