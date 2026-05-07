import { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            // Save the token so the user stays logged in
            localStorage.setItem('token', res.data.token);
            alert("Login successful!");
            navigate('/dashboard'); // We will build this next!
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Welcome Back</h2>
                <div className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-6 font-bold hover:bg-indigo-700">Login</button>
                <p className="mt-4 text-center">Don't have an account? <Link to="/register" className="text-indigo-600">Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;