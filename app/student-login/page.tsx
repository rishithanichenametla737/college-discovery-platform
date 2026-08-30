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

return ( <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6"> <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

    <div className="text-center">
      <div className="text-5xl">🎓</div>

      <h1 className="mt-4 text-3xl font-bold text-blue-700">
        Student Login
      </h1>

      <p className="mt-2 text-gray-600">
        Login to continue to CollegeFinder.
      </p>
    </div>

    <form onSubmit={handleLogin} className="mt-8">

      <div>
        <label className="block font-semibold text-gray-700">
          📧 Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your registered email"
          required
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="mt-5">
        <label className="block font-semibold text-gray-700">
          🔒 Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
      >
        Login 🚀
      </button>

    </form>

    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600">
        Don't have an account?
      </p>

      <button
        type="button"
        onClick={() => router.push("/register")}
        className="mt-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
      >
        Create an Account →
      </button>
    </div>

    <div className="mt-6 border-t pt-5 text-center">
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="text-sm font-medium text-purple-600 hover:underline"
      >
        👨‍💼 Admin Login
      </button>
    </div>

    <button
      type="button"
      onClick={() => router.push("/")}
      className="mt-5 w-full text-gray-600 transition hover:text-blue-600"
    >
      ← Back to Home
    </button>

  </div>
</main>


);
}
