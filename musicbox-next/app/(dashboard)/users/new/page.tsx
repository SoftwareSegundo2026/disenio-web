"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { create, getTokenValue } from "@/lib/db";

export default function NewUser() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !fullName.trim() || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    const token = getTokenValue();
    if (!token) {
      setError("You must be logged in as an administrator to create accounts.");
      return;
    }

    setIsSubmitting(true);

    try {
      await create("users", {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        password,
      });
      router.push("/users");
    } catch {
      setError("Failed to create user account. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/users" className="hover:text-primary transition-colors">Users</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">New User</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">Add New User</h2>
          <p className="text-on-surface-variant text-sm mt-1">Create an administrative account with platform credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="space-y-unit">
            <label htmlFor="user-name" className="block text-sm font-semibold text-on-surface">Full Name</label>
            <input type="text" id="user-name" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="e.g. Jean Michel" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="space-y-unit">
              <label htmlFor="user-username" className="block text-sm font-semibold text-on-surface">Username</label>
              <input type="text" id="user-username" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder="username" />
            </div>
            <div className="space-y-unit">
              <label htmlFor="user-email" className="block text-sm font-semibold text-on-surface">Email Address</label>
              <input type="email" id="user-email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder="name@sonance.pro" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="space-y-unit">
              <label htmlFor="user-pass" className="block text-sm font-semibold text-on-surface">Temporary Password</label>
              <input type="password" id="user-pass" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder="••••••••" />
            </div>
          </div>

          {error && <p className="text-error-vibrant text-xs pt-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/users">
              <button type="button" className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">Cancel</button>
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
