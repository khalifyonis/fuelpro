'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Fuel } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/30">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 lg:p-10 shadow-2xl shadow-slate-900/10 border border-slate-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 mb-3">
            <Fuel className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Reset Password
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Instructions Sent</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              If an account exists with <span className="font-semibold text-gray-700">{email}</span>, you will receive password reset instructions.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0f1729] hover:bg-slate-800 text-white font-semibold rounded-xl text-sm shadow-lg shadow-slate-900/20 transition-all"
            >
              Send Reset Instructions
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
