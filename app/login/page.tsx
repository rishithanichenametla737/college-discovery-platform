"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

function handleLogin(event: FormEvent<HTMLFormElement>) {
event.preventDefault();


// ================= ADMIN LOGIN =================

if (
  email === "admin@collegefinder.com" &&
  password === "admin123"
) {
  localStorage.setItem("adminLoggedIn", "true");

  alert("Admin login successful! 🎉");

  router.push("/admin");
  return;
}

alert("Invalid email or password");


}

return ( <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-6">

  <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">

    {/* ================= HEADER ================= */}

    <div className="text-center">

      <div className="text-5xl">
        🎓
      </div>

      <h1 className="mt-4 text-3xl font-bold text-blue-700">
        CollegeFinder
      </h1>

      <p className="mt-2 font-medium text-gray-700">
        Admin Login
      </p>

    </div>

    {/* ================= LOGIN FORM ================= */}

    <form onSubmit={handleLogin} className="mt-8">

      {/* EMAIL */}

      <div>

        <label
          htmlFor="email"
          className="block font-semibold text-gray-800"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@collegefinder.com"
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
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          required
          className="mt-2 w-full rounded-lg border-2 border-gray-400 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />

      </div>

      {/* LOGIN BUTTON */}

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
      >
        🔐 Login
      </button>

    </form>

    {/* ================= DEMO ADMIN LOGIN ================= */}

    <div className="mt-6 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">

      <p className="font-bold text-blue-900">
        👨‍💼 Demo Admin Login
      </p>

      <div className="mt-3 space-y-1 rounded-lg bg-white p-3 text-sm text-gray-800">

        <p>
          <span className="font-semibold">Email:</span>{" "}
          admin@collegefinder.com
        </p>

        <p>
          <span className="font-semibold">Password:</span>{" "}
          admin123
        </p>

      </div>

    </div>

    {/* ================= REGISTER ================= */}

    <div className="mt-6 text-center">

      <p className="text-sm text-gray-700">
        New to CollegeFinder?
      </p>

      <button
        type="button"
        onClick={() => router.push("/register")}
        className="mt-2 font-semibold text-blue-700 transition hover:text-blue-900 hover:underline"
      >
        Create an Account →
      </button>

    </div>

    {/* ================= BACK TO HOME ================= */}

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
