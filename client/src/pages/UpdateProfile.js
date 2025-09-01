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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-edit text-teal-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Update Profile</h2>
            <p className="text-gray-500 mt-2">Keep your information up to date</p>
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
              <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
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
              <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
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
              className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              } transition`}
            >
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

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="/change-password" 
                className="text-sm text-center text-teal-600 hover:text-teal-800 font-medium py-2 px-4 bg-teal-50 rounded-lg transition"
              >
                <i className="fas fa-lock mr-1"></i>Change Password
              </a>
              <a 
                href="/profile" 
                className="text-sm text-center text-gray-600 hover:text-gray-800 font-medium py-2 px-4 bg-gray-50 rounded-lg transition"
              >
                <i className="fas fa-arrow-left mr-1"></i>Back to Profile
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">© 2023 Excel Analytics Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}