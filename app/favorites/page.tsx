"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const colleges = [
  {
    name: "ABC Engineering College",
    location: "Hyderabad",
    course: "Computer Science Engineering",
    fees: "₹1,20,000 / year",
    rating: "4.3 / 5",
    placement: "92%",
    type: "Private",
  },
  {
    name: "XYZ Institute of Technology",
    location: "Bangalore",
    course: "Information Technology",
    fees: "₹1,50,000 / year",
    rating: "4.5 / 5",
    placement: "94%",
    type: "Private",
  },
  {
    name: "National Engineering College",
    location: "Chennai",
    course: "Computer Science Engineering",
    fees: "₹1,10,000 / year",
    rating: "4.2 / 5",
    placement: "90%",
    type: "Government",
  },
  {
    name: "Andhra Institute of Technology",
    location: "Anantapur",
    course: "Electronics and Communication Engineering",
    fees: "₹90,000 / year",
    rating: "4.1 / 5",
    placement: "88%",
    type: "Private",
  },
  {
    name: "Delhi College of Engineering",
    location: "Delhi",
    course: "Mechanical Engineering",
    fees: "₹1,00,000 / year",
    rating: "4.4 / 5",
    placement: "91%",
    type: "Government",
  },
];

export default function FavoritesPage() {
  const router = useRouter();

  const [favoriteColleges, setFavoriteColleges] = useState<number[]>([]);

  // Load saved favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorite-colleges");

    if (savedFavorites) {
      try {
        setFavoriteColleges(JSON.parse(savedFavorites));
      } catch {
        setFavoriteColleges([]);
      }
    }
  }, []);

  // Remove favorite
  const removeFavorite = (index: number) => {
    const updatedFavorites = favoriteColleges.filter(
      (id) => id !== index
    );

    setFavoriteColleges(updatedFavorites);

    localStorage.setItem(
      "favorite-colleges",
      JSON.stringify(updatedFavorites)
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* ================= NAVIGATION ================= */}

      <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-8 py-5 shadow-sm">

        <button
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-blue-700"
        >
          CollegeFinder
        </button>

        <div className="flex gap-6 text-gray-700">

          <button
            onClick={() => router.push("/")}
            className="hover:text-blue-600"
          >
            Home
          </button>

          <button
            onClick={() => router.push("/#colleges")}
            className="hover:text-blue-600"
          >
            Colleges
          </button>

          <button
            onClick={() => router.push("/#comparison")}
            className="hover:text-blue-600"
          >
            Compare
          </button>

          <button
            className="flex items-center gap-2 font-semibold text-red-500"
          >
            ❤️ Favorites

            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
              {favoriteColleges.length}
            </span>
          </button>

        </div>

      </nav>

      {/* ================= HEADER ================= */}

      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-red-500">
            Your Wishlist
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            ❤️ My Favorite Colleges
          </h1>

          <p className="mt-3 text-gray-600">
            Colleges you saved for later.
          </p>

          <div className="mx-auto mt-6 inline-flex rounded-full bg-red-100 px-5 py-2 font-semibold text-red-600">
            {favoriteColleges.length} Saved College
            {favoriteColleges.length !== 1 ? "s" : ""}
          </div>

        </div>

      </section>

      {/* ================= FAVORITE COLLEGES ================= */}

      <section className="mx-auto max-w-6xl px-6 pb-20">

        {favoriteColleges.length === 0 ? (

          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

            <div className="text-6xl">
              💔
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              No Favorite Colleges
            </h2>

            <p className="mt-2 text-gray-600">
              You haven't saved any colleges yet.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Colleges
            </button>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {favoriteColleges.map((index) => {

              const college = colleges[index];

              if (!college) return null;

              return (

                <div
                  key={index}
                  className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* ICON */}

                  <div className="flex items-center justify-between">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl">
                      🎓
                    </div>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                      ❤️ Saved
                    </span>

                  </div>

                  {/* NAME */}

                  <h2 className="mt-5 text-xl font-bold text-gray-900">
                    {college.name}
                  </h2>

                  {/* DETAILS */}

                  <div className="mt-4 space-y-2">

                    <p className="text-gray-600">
                      📍 {college.location}
                    </p>

                    <p className="text-gray-600">
                      📚 {college.course}
                    </p>

                    <p className="text-gray-600">
                      💰 {college.fees}
                    </p>

                    <p className="text-gray-600">
                      🏫 {college.type}
                    </p>

                    <p className="text-gray-600">
                      ⭐ {college.rating}
                    </p>

                    <p className="text-gray-600">
                      📊 Placement: {college.placement}
                    </p>

                  </div>

                  {/* BUTTONS */}

                  <div className="mt-6 flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        router.push(`/colleges/${index}`)
                      }
                      className="rounded-xl bg-blue-100 px-4 py-2 font-medium text-blue-700 hover:bg-blue-200"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() =>
                        removeFavorite(index)
                      }
                      className="rounded-xl bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
                    >
                      ❤️ Remove
                    </button>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </section>

      {/* ================= BACK BUTTON ================= */}

      <div className="pb-16 text-center">

        <button
          onClick={() => router.push("/")}
          className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700"
        >
          ← Back to Colleges
        </button>

      </div>

      {/* ================= FOOTER ================= */}

      <footer className="border-t bg-white px-6 py-8 text-center">

        <h3 className="text-xl font-bold text-blue-700">
          CollegeFinder
        </h3>

        <p className="mt-2 text-gray-500">
          Find. Compare. Choose your future.
        </p>

        <p className="mt-4 text-sm text-gray-400">
          © 2026 CollegeFinder. All rights reserved.
        </p>

      </footer>

    </main>
  );
}