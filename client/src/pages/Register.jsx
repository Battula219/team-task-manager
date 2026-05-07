import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
    // Added 'role' with a default value of 'User'
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        role: 'User' 
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            alert("Success! Please log in.");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="bg-white p-10 rounded-[40px] shadow-xl w-full max-w-md border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">T</div>
                </div>
                <h2 className="text-3xl font-black mb-2 text-center text-slate-800">Create Account</h2>
                <p className="text-slate-400 text-center mb-8 text-sm">Join TaskFlow to manage your work</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-2 mb-1 block">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@company.com" 
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-2 mb-1 block">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>

                    {/* NEW ROLE SELECTION BOX */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-2 mb-1 block">Account Type</label>
                        <select 
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="User">Standard User (Personal)</option>
                            <option value="Admin">Administrator (Manager)</option>
                        </select>
                    </div>

                    <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] mt-2">
                        Create Account
                    </button>
                </form>
                
                <p className="mt-6 text-center text-slate-500 text-sm">
                    Already have an account? <Link to="/" className="text-indigo-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;