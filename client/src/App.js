import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "./store";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between bg-gray-900 text-white px-6 py-4 shadow-md z-50">
        {/* Left: Logo + Title */}
        <div className="flex items-center space-x-3">
          <img src="/excel-bg.png" alt="logo" className="w-8 h-8" />
          <Link
            to="/"
            className="text-lg font-bold tracking-wide hover:text-teal-400"
          >
            Excel Analytics Platform
          </Link>
        </div>

        {/* Right: Links or Profile */}
        <div className="flex items-center space-x-6">
          {!auth.token ? (
            <>
              <Link to="/login" className="hover:text-teal-400 font-medium">
                Login
              </Link>
              <Link to="/register" className="hover:text-teal-400 font-medium">
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Profile Avatar */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700 transition"
              >
                <img
                  src="/avatar.png"
                  alt="profile"
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <span className="font-medium">
                  {auth.user?.name || "User"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden border border-gray-700">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Update Profile
                  </Link>
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(clearAuth());
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-20 p-6 bg-gray-950 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/update" element={<UpdateProfile />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
