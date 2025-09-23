import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../store";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: OTP and new password
  const dispatch = useDispatch();
  const nav = useNavigate();

  // Remove any default margin/padding from the body when component mounts
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
    };
  }, []);

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      dispatch(setAuth(res.data));
      nav("/");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setIsForgotPasswordLoading(true);
    setForgotPasswordError("");
    setForgotPasswordMessage("");
    setIsOtpVerified(false); // Reset OTP verification status
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: forgotPasswordEmail
      });
      setForgotPasswordMessage(res.data.msg);
      setResetStep(2); // Move to OTP entry step
    } catch (err) {
      setForgotPasswordError(err.response?.data?.msg || err.message || "Failed to send OTP");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setForgotPasswordError("OTP must be 6 digits");
      return;
    }
    
    setIsForgotPasswordLoading(true);
    setForgotPasswordError("");
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: forgotPasswordEmail,
        otp,
      });
      
      setForgotPasswordMessage("OTP verified successfully");
      setIsOtpVerified(true);
    } catch (err) {
      setForgotPasswordError(err.response?.data?.msg || "Failed to verify OTP");
      setIsOtpVerified(false);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  async function handleResetPassword(e) {
    e.preventDefault();
    
    if (!isOtpVerified) {
      return setForgotPasswordError("Please verify OTP first");
    }
    
    if (newPassword !== confirmPassword) {
      return setForgotPasswordError("Passwords do not match");
    }
    
    setIsForgotPasswordLoading(true);
    setForgotPasswordError("");
    
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password`, {
        email: forgotPasswordEmail, 
        otp, 
        password: newPassword
      });
      
      setForgotPasswordMessage(res.data.msg);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetStep(1);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setIsOtpVerified(false);
      }, 3000);
    } catch (err) {
      // More detailed error handling
      if (err.response?.status === 400) {
        setForgotPasswordError("OTP is invalid or has expired. Please request a new one.");
      } else {
        setForgotPasswordError(err.response?.data?.msg || err.message || "Failed to reset password");
      }
    } finally {
      setIsForgotPasswordLoading(false);
    }
  }

  // Resend OTP function
  async function handleResendOtp() {
    setIsForgotPasswordLoading(true);
    setForgotPasswordError("");
    setIsOtpVerified(false);
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: forgotPasswordEmail
      });
      setForgotPasswordMessage("New OTP has been sent to your email");
    } catch (err) {
      setForgotPasswordError(err.response?.data?.msg || err.message || "Failed to resend OTP");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  }

  // Particle animation effect
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system
    const particles = [];
    const particleCount = 200;
    const colors = ['#eeeeeeff', '#ffffffff', '#bcbcbcff', '#ffffffff', '#fffefeff'];
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 5 + 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connect particles with lines
    function connectParticles() {
      const maxDistance = 100;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = '#ffffffff';
            ctx.globalAlpha = 0.1 * (1 - distance / maxDistance);
            ctx.lineWidth = 2;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 overflow-hidden">
      
      {/* Particle Canvas Background */}
      <canvas 
        id="particle-canvas" 
        className="absolute inset-0 w-full h-full opacity-100"
      />
      
      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZmlsbD0ibm9uZSIxc3Ryb2tlPSIjMWZmNzlhIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBkPSJNMCwwIEw0MCw0MCBNNDAsMCBMMCw0MCIgLz48L3N2Zz4=')] opacity-0 animate-gradient-x"></div>
      
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
            <span className="text-green-400">Visualize</span> your data <br />
            with us today.
          </h2>
          <p className="mt-4 text-gray-300 text-lg">
            Securely log in to start exploring your Excel sheets in powerful visual formats.
          </p>
        </div>

        {/* Right Side Floating Card */}
        <div className="bg-gray-900/90 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-green-600/40 transform transition-all duration-300 hover:shadow-green-500/20 hover:border-green-500/60">
          {!showForgotPassword ? (
            <>
              <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login
              </h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm animate-pulse">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={submit} className="space-y-5">
                
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotPasswordEmail(form.email); // Pre-fill with login email
                    }}
                    className="text-sm text-green-400 hover:underline transition"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
                    isLoading 
                      ? "bg-gray-700 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } transition shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Login
                    </>
                  )}
                </button>
              </form>

              {/* Extra links */}
              <p className="text-gray-400 text-sm text-center mt-6">
                Don't have an account?{" "}
                <Link to="/register" className="text-green-400 hover:underline font-medium transition hover:text-green-300">
                  <i className="fas fa-user-plus mr-1"></i>
                  Register
                </Link>
              </p>
            </>
          ) : (
            /* Forgot Password Form */
            <>
              <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
                <i className="fas fa-key mr-2"></i>
                Reset Password
              </h2>
              
              {forgotPasswordError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm animate-pulse">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {forgotPasswordError}
                </div>
              )}
              
              {forgotPasswordMessage && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
                  <i className="fas fa-check-circle mr-2"></i>
                  {forgotPasswordMessage}
                </div>
              )}
              
              {resetStep === 1 ? (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">
                      <i className="far fa-envelope mr-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                                 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      required
                      disabled={isForgotPasswordLoading}
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Enter your email address and we'll send you an OTP to reset your password.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetStep(1);
                      }}
                      className="flex-1 py-3 px-4 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotPasswordLoading}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
                        isForgotPasswordLoading 
                          ? "bg-gray-700 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-700 text-white"
                      } transition shadow-lg hover:shadow-green-500/30`}
                    >
                      {isForgotPasswordLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Send OTP
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">
                      <i className="fas fa-shield-alt mr-2"></i>
                      OTP Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                          setIsOtpVerified(false); // Reset verification if OTP changes
                        }}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                                   text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        required
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isForgotPasswordLoading || otp.length !== 6}
                        className={`px-4 py-3 rounded-lg font-semibold flex items-center justify-center ${
                          isOtpVerified
                            ? "bg-green-600 text-white"
                            : (isForgotPasswordLoading || otp.length !== 6)
                            ? "bg-gray-700 cursor-not-allowed text-gray-400"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        } transition`}
                      >
                        {isForgotPasswordLoading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : isOtpVerified ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      Check your email for the OTP. It expires in 10 minutes.
                      {isOtpVerified && (
                        <span className="text-green-400 ml-2">
                          <i className="fas fa-check-circle mr-1"></i>Verified
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isForgotPasswordLoading}
                      className="text-sm text-green-400 hover:underline mt-2 transition"
                    >
                      {isForgotPasswordLoading ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">
                      <i className="fas fa-lock mr-2"></i>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                                 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      required
                      minLength={6}
                      placeholder="Enter new password"
                      disabled={!isOtpVerified}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-200 mb-2 font-medium">
                      <i className="fas fa-lock mr-2"></i>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
                                 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      required
                      placeholder="Confirm new password"
                      disabled={!isOtpVerified}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      className="flex-1 py-3 px-4 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotPasswordLoading || !isOtpVerified}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
                        (isForgotPasswordLoading || !isOtpVerified) 
                          ? "bg-gray-700 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-700 text-white"
                      } transition shadow-lg hover:shadow-green-500/30`}
                    >
                      {isForgotPasswordLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Resetting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-key mr-2"></i>
                          Reset Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        /* Ensure no default margins */
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        /* Ensure the root element takes full height */
        #root {
          height: 100vh;
        }
      `}</style>
    </div>
  );
}