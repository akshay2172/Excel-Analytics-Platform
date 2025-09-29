import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP and new password
  const navigate = useNavigate();

  async function handleSendOtp(e) {
    e.preventDefault();
    
    if (!email) {
      return setError("Please enter your email address");
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/forgot-password`, {
        email
      });
      
      setMessage(res.data.msg);
      setStep(2); 
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    
    if (otp.length !== 6) {
      return setError("OTP must be 6 digits");
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password`, {
        email, otp, password
      });
      
      setMessage(res.data.msg);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
          Reset Your Password
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
            {message}
          </div>
        )}
        
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-gray-200 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                required
                placeholder="Enter your email address"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-200 mb-2">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                required
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              <p className="text-gray-400 text-xs mt-1">
                Check your email for the OTP. It expires in 10 minutes.
              </p>
            </div>
            
            <div>
              <label className="block text-gray-200 mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-gray-200 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Back to Email Entry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}