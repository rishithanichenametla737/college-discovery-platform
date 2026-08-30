"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Student = {
  name: string;
  email: string;
  password: string;
};

export default function StudentLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const savedStudent = localStorage.getItem("collegeFinderStudent");

    if (!savedStudent) {
      alert("No account found. Please create an account first.");
      router.push("/register");
      return;
    }

    try {
      const student: Student = JSON.parse(savedStudent);

      if (
        email.trim().toLowerCase() === student.email.toLowerCase() &&
        password === student.password
      ) {
        localStorage.setItem("studentLoggedIn", "true");
        localStorage.setItem("studentName", student.name);

        alert(`Welcome back, ${student.name}! 🎉`);

        router.push("/");
      } else {
        alert("Invalid email or password.");
      }
    } catch {
      alert("Something went wrong. Please register again.");
      localStorage.removeItem("collegeFinderStudent");
      router.push("/register");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">

        {/* HEADER */}
        <div className="text-center">
          <div className="text-5xl">🎓</div>

          <h1 className="mt-4 text-3xl font-bold text-blue-700">
            Student Login
          </h1>

          <p className="mt-2 font-medium text-gray-700">
            Login to continue to CollegeFinder.
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="mt-8">

          {/* EMAIL */}
          <div>
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
              placeholder="Enter your registered email"
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
              placeholder="Enter your password"
              required
              className="mt-2 w-full rounded-lg border-2 border-gray-400 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Login 🚀
          </button>
        </form>

        {/* REGISTER */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="mt-2 font-semibold text-blue-700 hover:text-blue-900 hover:underline"
          >
            Create an Account →
          </button>
        </div>

        {/* ADMIN LOGIN */}
        <div className="mt-6 border-t border-gray-200 pt-5 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-purple-700 hover:underline"
          >
            👨‍💼 Admin Login
          </button>
        </div>

        {/* BACK TO HOME */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-5 w-full rounded-lg py-2 font-medium text-gray-700 transition hover:bg-gray-100 hover:text-blue-700"
        >
          ← Back to Home
        </button>

      </div>
    </main>
  );
}