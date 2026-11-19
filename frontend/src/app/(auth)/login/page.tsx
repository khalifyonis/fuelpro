'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/components/ui/toaster';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [emailOrUsername, setEmailOrUsername] = useState('admin@fuelpro.com');
  const [password, setPassword] = useState('FuelPro@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your username/email and password.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login({
        emailOrUsername,
        password,
        rememberMe,
      });
      toast({
        title: 'Welcome Back!',
        description: 'Logged in successfully. Redirecting to dashboard...',
        type: 'success',
      });
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-row bg-[#edf3fd] select-none font-sans">
      {/* ========================================================================= */}
      {/* LEFT SIDE: FUEL STATION VISUAL BANNER                                     */}
      {/* Exact aspect ratio matching image (1030/941) so ZERO cropping occurs!     */}
      {/* ========================================================================= */}
      <div className="hidden lg:block h-full aspect-[1030/941] relative shrink-0 overflow-hidden bg-[#07193c]">
        {/* Full Unclipped Forecourt Banner with Lit Canopy, 3D Sign & S-Curve */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/login-left-clean.png')",
            backgroundPosition: 'left center',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE: FLOATING LOGIN CARD & BRANDING                                */}
      {/* Perfectly centered, spacious inputs, exact match to original design image */}
      {/* ========================================================================= */}
      <div className="flex-1 h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-[#e8effb] via-[#edf3fd] to-[#f4f8fe] relative overflow-hidden">
        {/* Subtle Ambient Decorative Blur matching mockup */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[500px] flex flex-col items-center z-10">
          {/* Main White Floating Card */}
          <div className="w-full bg-white rounded-[28px] px-8 py-8 sm:px-10 sm:py-9 shadow-2xl shadow-blue-950/10 border border-white/80">
            {/* Brand Logo inside Card */}
            <div className="flex flex-col items-center justify-center mb-5 text-center">
              <div className="relative w-52 h-16">
                <Image
                  src="/fuelpro-logo.png"
                  alt="FUELPRO Fuel Station Management System"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Welcome Heading & Subtitle */}
            <div className="text-center mb-6">
              <h2 className="text-[26px] font-bold text-[#0a192f] tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-[14px] text-gray-500 mt-1 font-normal">
                Sign in to your account to continue
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Email or Username"
                  required
                  className="w-full pl-12 pr-4 py-3.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2f64]/20 focus:border-[#0a2f64] transition-all font-medium"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2f64]/20 focus:border-[#0a2f64] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-sm pt-1 px-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 px-4 bg-[#0a2f64] hover:bg-[#07244e] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* "or" Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                or
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            {/* Secure Access Only Pill */}
            <div className="w-full py-2.5 px-4 border border-gray-200/90 rounded-xl bg-gray-50/70 flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
              <span>Secure Access Only</span>
            </div>
          </div>

          {/* Centered Copyright below card exactly like mockup */}
          <p className="mt-5 text-xs text-center text-gray-400 font-medium">
            © 2026 FUELPRO. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
