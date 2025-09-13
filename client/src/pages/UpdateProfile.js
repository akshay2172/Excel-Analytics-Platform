import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../store";
import axios from "axios";

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: auth.user?.name || "",
    email: auth.user?.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    setIsLoading(true);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/update",
        form,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      // Update redux with new user info
      dispatch(setAuth({ token: auth.token, user: res.data.user }));
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.msg || err.message || "An error occurred", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-black z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/10 to-green-900/30 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black z-0"></div>
      
      {/* Subtle animated elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-green-700 rounded-full mix-blend-soft-light filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-green-600 rounded-full mix-blend-soft-light filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-green-800 rounded-full mix-blend-soft-light filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      
      <div className="max-w-md mx-auto relative z-10">
        {/* Profile card with glowing border */}
        <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-green-500/30 relative overflow-hidden">
          {/* Glowing border effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-green-600/10 to-green-400/10 rounded-2xl blur-md opacity-70"></div>
          <div className="absolute inset-0 border border-green-500/20 rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-900 to-black rounded-full flex items-center justify-center mx-auto mb-4 border border-green-600/40 shadow-lg shadow-green-700/30">
                <i className="fas fa-user-edit text-green-400 text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-white">Update Profile</h2>
              <p className="text-gray-400 mt-2">Keep your information up to date</p>
            </div>
            
            {message.text && (
              <div className={`mb-6 p-3 rounded-lg text-center ${
                message.type === "error" 
                  ? "bg-red-900/30 border border-red-700/50 text-red-200" 
                  : "bg-green-900/30 border border-green-700/50 text-green-200"
              }`}>
                <i className={`fas ${message.type === "error" ? "fa-exclamation-circle" : "fa-check-circle"} mr-2`}></i>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-500"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="far fa-user text-gray-400"></i>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-500"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="far fa-envelope text-gray-400"></i>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center relative overflow-hidden ${
                  isLoading 
                    ? "bg-gray-700 cursor-not-allowed text-gray-400" 
                    : "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white"
                } transition-all shadow-lg hover:shadow-green-700/30`}
              >
                {/* Button shine effect */}
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating Profile...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="/change-password" 
                  className="text-sm text-center text-green-400 hover:text-green-300 font-medium py-2 px-4 bg-green-900/30 rounded-lg transition-all border border-green-700/30 hover:border-green-600/50 hover:bg-green-900/40"
                >
                  <i className="fas fa-lock mr-1"></i>Change Password
                </a>
                <a 
                  href="/profile" 
                  className="text-sm text-center text-gray-400 hover:text-gray-300 font-medium py-2 px-4 bg-gray-800/50 rounded-lg transition-all border border-gray-700/30 hover:border-gray-600/50 hover:bg-gray-800/70"
                >
                  <i className="fas fa-arrow-left mr-1"></i>Back to Profile
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">© 2023 Excel Analytics Platform. All rights reserved.</p>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}