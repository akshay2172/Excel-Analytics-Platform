
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../store";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      dispatch(setAuth(res.data));
      nav("/");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 overflow-hidden relative">
      
      {/* Background Excel Grid Overlay - Fixed to cover entire screen */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWZmNzlhIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBkPSJNMCwwIEw0MCw0MCBNNDAsMCBMMCw0MCIgLz48L3N2Zz4=')] opacity-30"></div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center w-full max-w-6xl">
        
        {/* Left Side Quote */}
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Excel Analytics Platform
          </h1>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
            Join us and <span className="text-green-400">transform</span> <br />
            your data into insights.
          </h2>
          <p className="mt-4 text-gray-300 text-lg">
            Create your account today and start visualizing your data like never before.
          </p>
        </div>

        {/* Right Side Floating Card */}
        <div className="bg-gray-900/90 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-green-600/40">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
            <i className="fas fa-user-plus mr-2"></i>
            Create Account
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
          
          <form onSubmit={submit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-200 mb-2 font-medium">
                <i className="far fa-user mr-2"></i>
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                             text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-200 mb-2 font-medium">
                <i className="far fa-envelope mr-2"></i>
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                             text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-200 mb-2 font-medium">
                <i className="fas fa-lock mr-2"></i>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                             text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
                isLoading 
                  ? "bg-gray-700 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              } transition shadow-lg hover:shadow-green-500/30`}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Register
                </>
              )}
            </button>
          </form>

          {/* Extra link */}
          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:underline font-medium">
              <i className="fas fa-sign-in-alt mr-1"></i>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}