"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type College = {
id: number;
name: string;
rating: number;
};

export default function AdminPage() {
const router = useRouter();

const [colleges, setColleges] = useState<College[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");

if (isAdminLoggedIn !== "true") {
  router.replace("/login");
  return;
}

async function loadDashboard() {
  try {
    const response = await fetch("/api/colleges");

    if (!response.ok) {
      throw new Error("Failed to load colleges");
    }

    const data: College[] = await response.json();

    setColleges(data);
  } catch (error) {
    console.error("Dashboard error:", error);
  } finally {
    setLoading(false);
  }
}

loadDashboard();


}, [router]);

const totalColleges = colleges.length;

const averageRating =
colleges.length === 0
? 0
: colleges.reduce(
(total, college) => total + college.rating,
0
) / colleges.length;

const handleLogout = () => {
localStorage.removeItem("adminLoggedIn");
router.push("/login");
};

if (loading) {
return ( <main className="flex min-h-screen items-center justify-center bg-gray-100"> <p className="text-xl font-semibold text-blue-700">
Loading Dashboard... </p> </main>
);
}

return ( <main className="min-h-screen bg-gray-100"> <header className="bg-blue-700 px-6 py-5 text-white shadow"> <div className="mx-auto flex max-w-6xl items-center justify-between"> <div> <p className="text-sm font-semibold tracking-wide">
ADMIN PANEL </p>

        <h1 className="text-2xl font-bold">
          CollegeFinder Dashboard
        </h1>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-gray-100"
        >
          Website
        </button>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  </header>

  <section className="mx-auto max-w-6xl px-6 py-10">
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-3xl font-bold text-gray-900">
        Dashboard Overview
      </h2>

      <p className="mt-2 text-gray-600">
        Welcome back! Here is an overview of your CollegeFinder platform.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-blue-50 p-6">
          <p className="text-gray-600">
            🏫 Total Colleges
          </p>

          <p className="mt-3 text-4xl font-bold text-blue-700">
            {totalColleges}
          </p>
        </div>

        <div className="rounded-xl bg-yellow-50 p-6">
          <p className="text-gray-600">
            ⭐ Average Rating
          </p>

          <p className="mt-3 text-4xl font-bold text-yellow-600">
            {averageRating.toFixed(1)}
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-6">
          <p className="text-gray-600">
            🟢 Platform Status
          </p>

          <p className="mt-3 text-2xl font-bold text-green-600">
            Active
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-900">
          Quick Actions
        </h3>

        <p className="mt-2 text-gray-600">
          Manage your CollegeFinder platform.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            🌐 View Website
          </button>

          <button
            onClick={() => router.push("/admin/colleges")}
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            🏫 Manage Colleges
          </button>
        </div>
      </div>
    </div>
  </section>
</main>


);
}
