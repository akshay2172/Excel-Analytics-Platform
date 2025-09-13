import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "./store";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import UpdateProfile from "./pages/UpdateProfile";
import './index.css'



// Create a separate component for the navigation that uses useNavigate
function Navigation() {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(clearAuth());
    setDropdownOpen(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
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
              <Link to="/login" className="hover:text-teal-400 font-medium flex items-center">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login
              </Link>
              <Link to="/register" className="hover:text-teal-400 font-medium flex items-center">
                <i className="fas fa-user-plus mr-2"></i>
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
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
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden border border-gray-700 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 hover:bg-gray-700 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="far fa-user-circle w-5 mr-3 text-teal-400"></i>
                    <span>View Profile</span>
                  </Link>
                  <Link
                    to="/update"
                    className="flex items-center px-4 py-3 hover:bg-gray-700 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="far fa-edit w-5 mr-3 text-teal-400"></i>
                    <span>Update Profile</span>
                  </Link>
                  <Link
                    to="/change-password"
                    className="flex items-center px-4 py-3 hover:bg-gray-700 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="fas fa-lock w-5 mr-3 text-teal-400"></i>
                    <span>Change Password</span>
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-3 hover:bg-red-600 transition"
                  >
                    <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Page Content - Remove margin/padding to fix background */}
      <div className="pt-20 min-h-screen bg-gray-950">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/update" element={<UpdateProfile />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;