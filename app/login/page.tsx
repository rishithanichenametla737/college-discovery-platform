"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

function handleLogin(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

// Admin Login
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

return ( <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6"> <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

    {/* HEADER */}

    <div className="text-center">
      <div className="text-5xl">🎓</div>

      <h1 className="mt-4 text-3xl font-bold text-blue-700">
        CollegeFinder
      </h1>

      <p className="mt-2 text-gray-600">
        Admin Login
      </p>
    </div>

    {/* LOGIN FORM */}

    <form onSubmit={handleLogin} className="mt-8">

      {/* EMAIL */}

      <div>
        <label className="block font-semibold text-gray-700">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@collegefinder.com"
          required
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* PASSWORD */}

      <div className="mt-5">
        <label className="block font-semibold text-gray-700">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          required
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* LOGIN BUTTON */}

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
      >
        Login
      </button>

    </form>

    {/* DEMO ADMIN LOGIN */}

    <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
      <p className="font-bold text-blue-800">
        👨‍💼 Demo Admin Login
      </p>

      <p className="mt-2 text-sm text-gray-700">
        Email: admin@collegefinder.com
      </p>

      <p className="text-sm text-gray-700">
        Password: admin123
      </p>
    </div>

    {/* REGISTER */}

    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600">
        New to CollegeFinder?
      </p>

      <button
        type="button"
        onClick={() => router.push("/register")}
        className="mt-2 font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
      >
        Create an Account →
      </button>
    </div>

    {/* BACK TO HOME */}

    <button
      type="button"
      onClick={() => router.push("/")}
      className="mt-6 w-full text-gray-600 transition hover:text-blue-600"
    >
      ← Back to Home
    </button>

  </div>
</main>


);
}
