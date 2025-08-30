import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const auth = useSelector(s => s.auth);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    if (!auth.token) return;
    axios
      .get('http://localhost:5000/api/file', {
        headers: { Authorization: 'Bearer ' + auth.token },
      })
      .then((r) => setUploads(r.data))
      .catch((e) => console.error(e));
  }, [auth.token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-indigo-700 p-6 shadow-lg">
        <h1 className="text-3xl font-bold">📊 Dashboard</h1>
        {auth.user ? (
          <p className="mt-2 text-gray-200">
            Welcome, <span className="font-semibold text-white">{auth.user.name || auth.user.email}</span>
          </p>
        ) : (
          <p className="mt-2 text-gray-300">Please login</p>
        )}
      </header>

      <main className="p-6 space-y-8">
        {/* Upload Section */}
        {auth.token && (
          <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upload New Excel File</h2>
            <UploadForm
              onUploaded={() => {
                axios
                  .get('http://localhost:5000/api/file', {
                    headers: { Authorization: 'Bearer ' + auth.token },
                  })
                  .then((r) => setUploads(r.data));
              }}
            />
          </section>
        )}

        {/* Uploads List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Uploads</h2>
          {uploads.length > 0 ? (
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map((u) => (
                <li
                  key={u._id}
                  className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl transition"
                >
                  <strong className="block text-lg">{u.filename}</strong>
                  <span className="text-sm text-gray-400">Rows: {u.parsed?.length || 0}</span>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(u.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No uploads yet 🚀</p>
          )}
        </section>
      </main>
    </div>
  );
}
