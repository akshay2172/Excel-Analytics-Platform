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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/update",
        form,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      // Update redux with new user info
      dispatch(setAuth({ token: auth.token, user: res.data.user }));
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 
                         text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 
                         text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
