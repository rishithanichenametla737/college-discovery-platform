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

return ( <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6"> <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

    <div className="text-center">
      <div className="text-5xl">🎓</div>

      <h1 className="mt-4 text-3xl font-bold text-blue-700">
        Create Account
      </h1>

      <p className="mt-2 text-gray-600">
        Join CollegeFinder and discover your future.
      </p>
    </div>

    <form onSubmit={handleRegister} className="mt-8">

      <div>
        <label className="block font-semibold text-gray-700">
          Full Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your full name"
          required
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-5">
        <label className="block font-semibold text-gray-700">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-5">
        <label className="block font-semibold text-gray-700">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          required
          minLength={6}
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
        />

        <p className="mt-2 text-sm text-gray-500">
          Password must contain at least 6 characters.
        </p>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Create Account
      </button>

    </form>

    <p className="mt-6 text-center text-sm text-gray-600">
      Already have an account?
    </p>

    <button
      type="button"
      onClick={() => router.push("/student-login")}
      className="mt-2 w-full text-blue-600 hover:underline"
    >
      Login Here
    </button>

    <button
      type="button"
      onClick={() => router.push("/")}
      className="mt-6 w-full text-gray-600 hover:text-blue-600"
    >
      ← Back to Home
    </button>

  </div>
</main>


);
}
