import React, { useState } from "react";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "" });

  function handleSubmit(e) {
    e.preventDefault();
    alert("Profile updated successfully!"); // Replace with API call
  }

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 py-2 rounded-lg font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
