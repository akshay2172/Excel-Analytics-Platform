import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ChangePassword() {
  const auth = useSelector((state) => state.auth);
  const [form, setForm] = useState({ 
    oldPassword: "", 
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Validation
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: "New passwords don't match", type: "error" });
      return;
    }

    if (form.newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/change-password",
        {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword
        },
        { 
          headers: { Authorization: `Bearer ${auth.token}` } 
        }
      );

      setMessage({ text: res.data.msg || "Password changed successfully!", type: "success" });
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordStrength(0);
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.msg || err.message || "An error occurred", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-teal-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
            <p className="text-gray-500 mt-2">Secure your account with a new password</p>
          </div>
          
          {message.text && (
            <div className={`mb-6 p-3 rounded-lg text-center ${
              message.type === "error" 
                ? "bg-red-50 border border-red-200 text-red-700" 
                : "bg-teal-50 border border-teal-200 text-teal-700"
            }`}>
              <i className={`fas ${message.type === "error" ? "fa-exclamation-circle" : "fa-check-circle"} mr-2`}></i>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.oldPassword ? "text" : "password"}
                  name="oldPassword"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Enter your current password"
                  value={form.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility("oldPassword")}
                >
                  <i className={`far ${showPasswords.oldPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  name="newPassword"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Create a new password"
                  value={form.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  <i className={`far ${showPasswords.newPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Password strength</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${getStrengthColor()}`} 
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Confirm your new password"
                  value={form.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  <i className={`far ${showPasswords.confirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
              {form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword && (
                <p className="text-xs mt-2 text-red-600">
                  <i className="fas fa-times-circle mr-1"></i>Passwords don't match
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              } transition`}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-gray-100">
            <a href="#" className="text-sm text-teal-600 hover:text-teal-800 font-medium">
              <i className="fas fa-question-circle mr-1"></i>Having trouble changing your password?
            </a>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">© 2023 Excel Analytics Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}