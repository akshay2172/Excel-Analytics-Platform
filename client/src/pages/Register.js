import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../store";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      dispatch(setAuth(res.data));
      nav("/");
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black animate-gradient px-10">
      
      {/* Title */}
      <h1 className="text-6xl font-extrabold text-white mb-20 z-10">
        Excel Analytics Platform
      </h1>

      {/* Main container: Text + Form */}
      <div className="relative z-10 flex flex-row gap-12 items-center">
        
        {/* Left Side Quote */}
        <div className="max-w-md text-left">
          <h2 className="text-4xl font-extrabold text-white leading-snug">
            Join us and <span className="text-green-400">transform</span> <br />
            your data into insights.
          </h2>
          <p className="mt-4 text-gray-300 text-lg">
            Create your account today and start visualizing your data like never before.
          </p>
        </div>

        {/* Right Side Floating Card */}
        <div className="bg-black/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-green-600/40 transform transition duration-500 hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
            Create Account
          </h2>
          <form onSubmit={submit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-200 mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-green-600 
                           text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-200 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-green-600 
                           text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-200 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-green-600 
                           text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-lg hover:shadow-green-500/50"
            >
              Register
            </button>
          </form>

          {/* Extra link */}
          <p className="text-gray-400 text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-green-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Background Excel Grid Overlay */}
<div className="absolute inset-0 bg-[url('/public/excel-bg.png')] bg-cover bg-center opacity-90 mix-blend-overlay"></div>


    </div>
  );
}
