import React, { useState } from "react";

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });

  function handleSubmit(e) {
    e.preventDefault();
    alert("Password changed successfully!"); // Replace with API call
  }

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            placeholder="Enter current password"
          />
        </div>
        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            placeholder="Enter new password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 py-2 rounded-lg font-semibold"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
