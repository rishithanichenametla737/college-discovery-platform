"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const student = {
      name: name.trim(),
      email: email.trim(),
      password: password,
    };

    localStorage.setItem("collegeFinderStudent", JSON.stringify(student));

    alert("Registration successful! 🎉");

    router.push("/student-login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">

        {/* HEADER */}
        <div className="text-center">
          <div className="text-5xl">🎓</div>

          <h1 className="mt-4 text-3xl font-bold text-blue-700">
            Create Account
          </h1>

          <p className="mt-2 font-medium text-gray-700">
            Join CollegeFinder and discover your future.
          </p>
        </div>

        {/* REGISTER FORM */}
        <form onSubmit={handleRegister} className="mt-8">

          {/* FULL NAME */}
          <div>
            <label
              htmlFor="name"
              className="block font-semibold text-gray-800"
            >
              👤 Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              required
              className="mt-2 w-full rounded-lg border-2 border-gray-400 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* EMAIL */}
          <div className="mt-5">
            <label
              htmlFor="email"
              className="block font-semibold text-gray-800"
            >
              📧 Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              className="mt-2 w-full rounded-lg border-2 border-gray-400 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* PASSWORD */}
          <div className="mt-5">
            <label
              htmlFor="password"
              className="block font-semibold text-gray-800"
            >
              🔒 Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
              className="mt-2 w-full rounded-lg border-2 border-gray-400 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-2 text-sm text-gray-600">
              Password must contain at least 6 characters.
            </p>
          </div>

          {/* CREATE ACCOUNT BUTTON */}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Create Account 🚀
          </button>
        </form>

        {/* LOGIN */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => router.push("/student-login")}
            className="mt-2 font-semibold text-blue-700 hover:text-blue-900 hover:underline"
          >
            Login Here →
          </button>
        </div>

        {/* BACK TO HOME */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-6 w-full rounded-lg py-2 font-medium text-gray-700 transition hover:bg-gray-100 hover:text-blue-700"
        >
          ← Back to Home
        </button>

      </div>
    </main>
  );
}