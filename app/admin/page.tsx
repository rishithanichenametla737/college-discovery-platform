"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type College = {
id: number;
name: string;
rating: number;
location: string;
placement: number;
};

export default function AdminPage() {
const router = useRouter();

const [colleges, setColleges] = useState<College[]>([]);
const [loading, setLoading] = useState(true);

// ================= ADMIN AUTH + LOAD DATA =================

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

// ================= STATISTICS =================

const totalColleges = colleges.length;

const averageRating =
colleges.length === 0
? 0
: colleges.reduce(
(total, college) => total + college.rating,
0
) / colleges.length;

const totalLocations = new Set(
colleges.map((college) => college.location)
).size;

const averagePlacement =
colleges.length === 0
? 0
: colleges.reduce(
(total, college) => total + college.placement,
0
) / colleges.length;

// ================= LOGOUT =================

const handleLogout = () => {
localStorage.removeItem("adminLoggedIn");
router.push("/login");
};

// ================= LOADING =================

if (loading) {
return ( <main className="flex min-h-screen items-center justify-center bg-gray-100"> <p className="text-xl font-semibold text-blue-700">
Loading Dashboard... </p> </main>
);
}

return ( <main className="min-h-screen bg-gray-100">

  {/* ================= HEADER ================= */}

  <header className="bg-blue-700 px-4 py-5 text-white shadow sm:px-6">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <p className="text-sm font-semibold tracking-wide">
          ADMIN PANEL
        </p>

        <h1 className="text-2xl font-bold">
          🎓 CollegeFinder Dashboard
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-gray-100"
        >
          🌐 Website
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

  {/* ================= DASHBOARD ================= */}

  <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">

    <div className="rounded-2xl bg-white p-5 shadow sm:p-8">

      {/* ================= TITLE ================= */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Dashboard Overview
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome back, Admin! 👋
        </h2>

        <p className="mt-2 text-gray-600">
          Here is an overview of your CollegeFinder platform.
        </p>
      </div>

      {/* ================= STATISTICS CARDS ================= */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

        {/* TOTAL COLLEGES */}

        <div className="rounded-xl bg-blue-50 p-6">

          <div className="text-3xl">🏫</div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            Total Colleges
          </p>

          <p className="mt-2 text-4xl font-bold text-blue-700">
            {totalColleges}
          </p>

        </div>

        {/* AVERAGE RATING */}

        <div className="rounded-xl bg-yellow-50 p-6">

          <div className="text-3xl">⭐</div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            Average Rating
          </p>

          <p className="mt-2 text-4xl font-bold text-yellow-600">
            {averageRating.toFixed(1)}
          </p>

        </div>

        {/* LOCATIONS */}

        <div className="rounded-xl bg-purple-50 p-6">

          <div className="text-3xl">📍</div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            Locations Covered
          </p>

          <p className="mt-2 text-4xl font-bold text-purple-700">
            {totalLocations}
          </p>

        </div>

        {/* AVERAGE PLACEMENT */}

        <div className="rounded-xl bg-indigo-50 p-6">

          <div className="text-3xl">📊</div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            Avg. Placement
          </p>

          <p className="mt-2 text-4xl font-bold text-indigo-700">
            {averagePlacement.toFixed(0)}%
          </p>

        </div>

        {/* PLATFORM STATUS */}

        <div className="rounded-xl bg-green-50 p-6">

          <div className="text-3xl">🟢</div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            Platform Status
          </p>

          <p className="mt-2 text-xl font-bold text-green-600">
            Active
          </p>

        </div>

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="mt-10 border-t pt-8">

        <h3 className="text-2xl font-bold text-gray-900">
          Quick Actions
        </h3>

        <p className="mt-2 text-gray-600">
          Manage your CollegeFinder platform quickly.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">

          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700"
          >
            🌐 View Website
          </button>

          <button
            onClick={() => router.push("/admin/colleges")}
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow hover:bg-purple-700"
          >
            🏫 Manage Colleges
          </button>

        </div>

      </div>

      {/* ================= COLLEGE SUMMARY ================= */}

      <div className="mt-10 border-t pt-8">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              College Summary
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Colleges currently available on the platform.
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            {totalColleges} Total Colleges
          </span>

        </div>

        {/* ================= TABLE ================= */}

        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">

                <th className="px-4 py-3">
                  College
                </th>

                <th className="px-4 py-3">
                  Location
                </th>

                <th className="px-4 py-3">
                  Rating
                </th>

                <th className="px-4 py-3">
                  Placement
                </th>

              </tr>
            </thead>

            <tbody>

              {colleges.map((college) => (

                <tr
                  key={college.id}
                  className="border-b transition hover:bg-blue-50"
                >

                  <td className="px-4 py-4 font-semibold text-gray-900">
                    🎓 {college.name}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    📍 {college.location}
                  </td>

                  <td className="px-4 py-4">
                    ⭐ {college.rating} / 5
                  </td>

                  <td className="px-4 py-4">
                    📊 {college.placement}%
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  </section>

</main>


);
}
