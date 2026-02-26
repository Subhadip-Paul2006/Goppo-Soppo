import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const { register, verifyOTP } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Form, 2: OTP
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', dob: '', gender: 'Male', preferred_genre: 'Detective'
    });
    const [userId, setUserId] = useState(null);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = await register(formData);
            setUserId(data.userId);
            setStep(2);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await verifyOTP(userId, otp);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'OTP Verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="bg-detective-dark p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-800">
                <h2 className="text-3xl font-serif text-gold-accent mb-6 text-center">
                    {step === 1 ? 'Join the Investigation' : 'Verify Identity'}
                </h2>

                {error && <div className="bg-red-900/50 text-red-200 p-2 mb-4 rounded text-center">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-gold-accent outline-none" />
                        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-gold-accent outline-none" />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-gold-accent outline-none" />
                        <input type="date" name="dob" onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-gold-accent outline-none" />

                        <div className="flex gap-4">
                            <select name="gender" onChange={handleChange} className="w-1/2 bg-black border border-gray-700 p-3 rounded text-white outline-none">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                            <select name="preferred_genre" onChange={handleChange} className="w-1/2 bg-black border border-gray-700 p-3 rounded text-white outline-none">
                                <option>Detective</option>
                                <option>Horror</option>
                                <option>Romance</option>
                                <option>Comedy</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-gold-accent text-black font-bold py-3 rounded hover:bg-yellow-500 transition-colors">
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <p className="text-gray-400 text-center text-sm">OTP sent to {formData.email}</p>
                        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full bg-black border border-gray-700 p-3 rounded text-white text-center text-2xl tracking-widest focus:border-gold-accent outline-none" />
                        <button type="submit" className="w-full bg-gold-accent text-black font-bold py-3 rounded hover:bg-yellow-500 transition-colors">
                            Verify & Enter
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <Link to="/login" className="text-gray-400 hover:text-white text-sm">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
