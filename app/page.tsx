"use client";

import { useEffect, useState } from "react";

interface College {
id: number;
name: string;
location: string;
course: string;
fees: number;
rating: number;
placement: number;
hostel: string;
type: string;
exams: string;
recruiters: string;
}

export default function Home() {
// ================= DATABASE =================

const [colleges, setColleges] = useState<College[]>([]);
const [loading, setLoading] = useState(true);

// ================= SEARCH + FILTER =================

const [search, setSearch] = useState("");
const [location, setLocation] = useState("All");
const [course, setCourse] = useState("All");

// ================= COMPARE =================

const [selectedColleges, setSelectedColleges] = useState<number[]>([]);

// ================= FAVORITES =================

const [favoriteColleges, setFavoriteColleges] = useState<number[]>([]);
const [mounted, setMounted] = useState(false);

// ================= STUDENT LOGIN =================

const [studentLoggedIn, setStudentLoggedIn] = useState(false);
const [studentName, setStudentName] = useState("");

// ================= LOAD COLLEGES =================

useEffect(() => {
const fetchColleges = async () => {
try {
const response = await fetch("/api/colleges");

    if (!response.ok) {
      throw new Error("Failed to load colleges");
    }

    const data = await response.json();
    setColleges(data);
  } catch (error) {
    console.error("Error loading colleges:", error);
  } finally {
    setLoading(false);
  }
};

fetchColleges();


}, []);

// ================= LOAD FAVORITES =================

useEffect(() => {
const savedFavorites = localStorage.getItem("college-favorites");

if (savedFavorites) {
  try {
    const parsedFavorites = JSON.parse(savedFavorites);

    if (Array.isArray(parsedFavorites)) {
      setFavoriteColleges(parsedFavorites);
    }
  } catch {
    setFavoriteColleges([]);
  }
}

setMounted(true);


}, []);

// ================= LOAD STUDENT LOGIN =================

useEffect(() => {
const loggedIn = localStorage.getItem("studentLoggedIn");
const name = localStorage.getItem("studentName");

if (loggedIn === "true") {
  setStudentLoggedIn(true);
}

if (name) {
  setStudentName(name);
}


}, []);

// ================= FILTER COLLEGES =================

const filteredColleges = colleges.filter((college) => {
const text = search.toLowerCase();

const matchesSearch =
  college.name.toLowerCase().includes(text) ||
  college.location.toLowerCase().includes(text) ||
  college.course.toLowerCase().includes(text);

const matchesLocation =
  location === "All" || college.location.includes(location);

const matchesCourse =
  course === "All" || college.course === course;

return matchesSearch && matchesLocation && matchesCourse;


});

// ================= COMPARE =================

const toggleCollege = (id: number) => {
if (selectedColleges.includes(id)) {
setSelectedColleges(
selectedColleges.filter((collegeId) => collegeId !== id)
);
} else {
if (selectedColleges.length < 2) {
setSelectedColleges([...selectedColleges, id]);
} else {
alert("You can compare only 2 colleges at a time.");
}
}
};

// ================= FAVORITES =================

const toggleFavorite = (id: number) => {
let updatedFavorites: number[];

if (favoriteColleges.includes(id)) {
  updatedFavorites = favoriteColleges.filter(
    (collegeId) => collegeId !== id
  );
} else {
  updatedFavorites = [...favoriteColleges, id];
}

setFavoriteColleges(updatedFavorites);

localStorage.setItem(
  "college-favorites",
  JSON.stringify(updatedFavorites)
);


};

// ================= CLEAR COMPARISON =================

const clearComparison = () => {
setSelectedColleges([]);
};

// ================= LOGOUT =================

const handleStudentLogout = () => {
localStorage.removeItem("studentLoggedIn");
localStorage.removeItem("studentName");

setStudentLoggedIn(false);
setStudentName("");

alert("You have been logged out successfully.");

window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

// ================= SCROLL =================

const scrollToTop = () => {
window.scrollTo({
top: 0,
behavior: "smooth",
});
};

const scrollToSection = (id: string) => {
document.getElementById(id)?.scrollIntoView({
behavior: "smooth",
});
};

// ================= FORMAT FEES =================

const formatFees = (fees: number) => {
return `₹${fees.toLocaleString("en-IN")} / year`;
};

// ================= GET COLLEGE =================

const getCollegeById = (id: number) => {
return colleges.find((college) => college.id === id);
};

// ================= COMPARISON COLLEGES =================

const comparisonColleges = selectedColleges
.map((id) => getCollegeById(id))
.filter((college): college is College => college !== undefined);

return ( <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

  {/* ================= NAVIGATION ================= */}

  <nav className="sticky top-0 z-50 bg-white shadow-sm">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">

      <button
        onClick={scrollToTop}
        className="shrink-0 text-xl font-bold text-blue-700 sm:text-2xl"
      >
        🎓 CollegeFinder
      </button>

      <div className="ml-4 flex items-center gap-2 overflow-x-auto text-sm text-gray-700 sm:gap-4 md:gap-6 md:text-base">

        <button
          onClick={scrollToTop}
          className="whitespace-nowrap hover:text-blue-600"
        >
          Home
        </button>

        <button
          onClick={() => scrollToSection("colleges")}
          className="whitespace-nowrap hover:text-blue-600"
        >
          Colleges
        </button>

        <button
          onClick={() => scrollToSection("comparison")}
          className="whitespace-nowrap hover:text-blue-600"
        >
          Compare
        </button>

        <button
          onClick={() => scrollToSection("favorites")}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap hover:text-red-500"
        >
          ❤️ Favorites

          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
            {mounted ? favoriteColleges.length : 0}
          </span>
        </button>

        {studentLoggedIn ? (
          <>
            <button
              onClick={() => alert(`Welcome, ${studentName}! 👋`)}
              className="whitespace-nowrap rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-100"
            >
              👤 {studentName}
            </button>

            <button
              onClick={handleStudentLogout}
              className="whitespace-nowrap rounded-lg bg-red-500 px-3 py-2 font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                window.location.href = "/student-login";
              }}
              className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Login
            </button>

            <button
              onClick={() => {
                window.location.href = "/register";
              }}
              className="whitespace-nowrap rounded-lg border border-blue-600 px-3 py-2 font-semibold text-blue-600 hover:bg-blue-50"
            >
              Register
            </button>
          </>
        )}

      </div>
    </div>
  </nav>

  {/* ================= HERO ================= */}

  <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6">

    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600 sm:text-base">
      Your College Discovery Platform
    </p>

    <h1 className="max-w-4xl text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
      Find the Right College for Your Future
    </h1>

    <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
      Explore colleges, compare courses, check locations, and discover the
      best college options for your career goals.
    </p>

    <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:mt-10 sm:flex-row">

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a college, course, or city..."
        className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none focus:border-blue-500 sm:px-5 sm:py-4"
      />

      <button
        onClick={() => scrollToSection("colleges")}
        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 sm:px-7 sm:py-4"
      >
        Search
      </button>

    </div>

    {/* FILTERS */}

    <div className="mt-4 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none focus:border-blue-500"
      >
        <option value="All">All Locations</option>
        <option value="Hyderabad">Hyderabad</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Chennai">Chennai</option>
        <option value="Anantapur">Anantapur</option>
        <option value="Delhi">Delhi</option>
      </select>

      <select
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none focus:border-blue-500"
      >
        <option value="All">All Courses</option>
        <option value="B.Tech Computer Science">
          B.Tech Computer Science
        </option>
        <option value="Computer Science Engineering">
          Computer Science Engineering
        </option>
        <option value="Information Technology">
          Information Technology
        </option>
        <option value="Electronics and Communication Engineering">
          Electronics and Communication Engineering
        </option>
        <option value="Mechanical Engineering">
          Mechanical Engineering
        </option>
      </select>

    </div>
  </section>

  {/* ================= COLLEGES ================= */}

  <section
    id="colleges"
    className="scroll-mt-24 px-4 pb-16 sm:px-6 md:px-8 md:pb-20"
  >

    <div className="mx-auto mb-8 max-w-6xl text-center sm:mb-10">

      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
        Explore
      </p>

      <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
        {search || location !== "All" || course !== "All"
          ? "Search Results"
          : "Popular Colleges"}
      </h2>

      <p className="mt-2 text-sm text-gray-600 sm:text-base">
        Select up to two colleges to compare them.
      </p>

    </div>

    {loading ? (
      <p className="text-center text-lg text-blue-600">
        Loading colleges from database...
      </p>
    ) : filteredColleges.length === 0 ? (
      <p className="text-center text-base text-gray-600 sm:text-lg">
        No colleges found. Try another search or filter.
      </p>
    ) : (
      <div className="mx-auto grid max-w-6xl gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filteredColleges.map((college) => {
          const isSelected = selectedColleges.includes(college.id);
          const isFavorite = favoriteColleges.includes(college.id);

          return (
            <div
              key={college.id}
              className="rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:p-6"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                  🎓
                </div>

                {isSelected && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Selected
                  </span>
                )}

              </div>

              <h3 className="mt-5 break-words text-lg font-bold text-gray-900 sm:text-xl">
                {college.name}
              </h3>

              <p className="mt-3 text-sm text-gray-600">
                📍 {college.location}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                📚 {college.course}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                💰 {formatFees(college.fees)}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                🏫 {college.type}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                ⭐ {college.rating} / 5
              </p>

              <p className="mt-2 text-sm text-gray-600">
                📊 Placement: {college.placement}%
              </p>

              <div className="mt-6 flex flex-wrap gap-2">

                <button
                  onClick={() => {
                    window.location.href = `/colleges/${college.id}`;
                  }}
                  className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                >
                  View Details
                </button>

                <button
                  onClick={() => toggleCollege(college.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isSelected
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {isSelected ? "✓ Selected" : "Compare"}
                </button>

                <button
                  onClick={() => toggleFavorite(college.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isFavorite
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {isFavorite ? "❤️ Saved" : "♡ Save"}
                </button>

              </div>

            </div>
          );
        })}

      </div>
    )}

  </section>

  {/* ================= FAVORITES ================= */}

  <section
    id="favorites"
    className="scroll-mt-24 mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-20"
  >

    <div className="mb-8 text-center">

      <p className="text-sm font-semibold uppercase tracking-wider text-red-500">
        Your Wishlist
      </p>

      <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
        ❤️ Saved Colleges
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Colleges you saved for later.
      </p>

      {mounted && favoriteColleges.length > 0 && (
        <p className="mt-2 text-sm font-semibold text-red-500">
          {favoriteColleges.length} Saved College
          {favoriteColleges.length !== 1 ? "s" : ""}
        </p>
      )}

    </div>

    {favoriteColleges.length === 0 ? (

      <div className="rounded-2xl bg-white p-8 text-center shadow-md">

        <div className="text-5xl">🤍</div>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          No Favorites Yet
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Click ♡ Save on a college to add it to your wishlist.
        </p>

      </div>

    ) : (

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">

        {favoriteColleges.map((id) => {
          const college = getCollegeById(id);

          if (!college) return null;

          return (
            <div
              key={college.id}
              className="rounded-2xl border border-red-100 bg-white p-5 shadow-md"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                🎓
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {college.name}
              </h3>

              <p className="mt-3 text-sm text-gray-600">
                📍 {college.location}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                📚 {college.course}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                💰 {formatFees(college.fees)}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                ⭐ {college.rating} / 5
              </p>

              <p className="mt-2 text-sm text-gray-600">
                📊 Placement: {college.placement}%
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                <button
                  onClick={() => {
                    window.location.href = `/colleges/${college.id}`;
                  }}
                  className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                >
                  View Details
                </button>

                <button
                  onClick={() => toggleFavorite(college.id)}
                  className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
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

  {/* ================= COMPARISON ================= */}

  <section
    id="comparison"
    className="scroll-mt-24 mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-24"
  >

    <div className="mb-8 text-center sm:mb-10">

      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
        Compare Your Choices
      </p>

      <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
        College Comparison
      </h2>

      <p className="mt-3 text-sm text-gray-600">
        Compare important details side by side before making your decision.
      </p>

    </div>

    {comparisonColleges.length === 0 && (

      <div className="rounded-3xl bg-white p-10 text-center shadow-lg">

        <div className="text-6xl">⚖️</div>

        <h3 className="mt-5 text-2xl font-bold text-gray-900">
          Select 2 Colleges to Compare
        </h3>

        <p className="mx-auto mt-3 max-w-lg text-gray-600">
          Choose any two colleges from the Popular Colleges section and
          click the Compare button.
        </p>

        <button
          onClick={() => scrollToSection("colleges")}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          🎓 Explore Colleges
        </button>

      </div>
    )}

    {comparisonColleges.length === 1 && (

      <div className="rounded-3xl bg-white p-8 text-center shadow-lg">

        <div className="text-6xl">📚</div>

        <h3 className="mt-5 text-2xl font-bold text-gray-900">
          Select One More College
        </h3>

        <p className="mt-3 text-gray-600">
          You have selected:
        </p>

        <div className="mx-auto mt-4 max-w-md rounded-2xl bg-blue-50 p-5">

          <p className="text-lg font-bold text-blue-700">
            🎓 {comparisonColleges[0].name}
          </p>

          <p className="mt-2 text-gray-600">
            📍 {comparisonColleges[0].location}
          </p>

        </div>

        <button
          onClick={() => scrollToSection("colleges")}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Select Another College
        </button>

      </div>
    )}

    {comparisonColleges.length === 2 && (

      <>
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">

          {comparisonColleges.map((college, position) => (

            <div
              key={college.id}
              className="rounded-3xl border border-blue-200 bg-white p-5 shadow-lg sm:p-7"
            >

              <div className="mb-6 flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                  🎓
                </div>

                <div>
                  <p className="text-xs font-semibold text-blue-600">
                    COLLEGE {position + 1}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
                    {college.name}
                  </h3>
                </div>

              </div>

              <div className="space-y-3">

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">📍 Location</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {college.location}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">📚 Course</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {college.course}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">💰 Fees</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {formatFees(college.fees)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">⭐ Rating</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {college.rating} / 5
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">📊 Placement</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {college.placement}%
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">🏠 Hostel</p>
                  <p className="mt-1 font-semibold text-green-600">
                    {college.hostel}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    🏫 College Type
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {college.type}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    🎯 Entrance Exams
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {college.exams}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    💼 Top Recruiters
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {college.recruiters}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

        <div className="mt-8 rounded-3xl bg-blue-50 p-5 sm:p-7">

          <h3 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Quick Comparison
          </h3>

          <div className="mt-5 grid gap-4 text-center md:grid-cols-3">

            <div className="rounded-xl bg-white p-5">
              <p className="text-sm text-gray-500">
                ⭐ Higher Rating
              </p>

              <p className="mt-2 font-bold text-blue-700">
                {comparisonColleges[0].rating >
                comparisonColleges[1].rating
                  ? comparisonColleges[0].name
                  : comparisonColleges[0].rating <
                    comparisonColleges[1].rating
                  ? comparisonColleges[1].name
                  : "Both have the same rating"}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5">
              <p className="text-sm text-gray-500">
                📊 Better Placement
              </p>

              <p className="mt-2 font-bold text-blue-700">
                {comparisonColleges[0].placement >
                comparisonColleges[1].placement
                  ? comparisonColleges[0].name
                  : comparisonColleges[0].placement <
                    comparisonColleges[1].placement
                  ? comparisonColleges[1].name
                  : "Both have the same placement rate"}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5">
              <p className="text-sm text-gray-500">
                💰 Lower Fees
              </p>

              <p className="mt-2 font-bold text-blue-700">
                {comparisonColleges[0].fees <
                comparisonColleges[1].fees
                  ? comparisonColleges[0].name
                  : comparisonColleges[0].fees >
                    comparisonColleges[1].fees
                  ? comparisonColleges[1].name
                  : "Both have the same fees"}
              </p>
            </div>

          </div>

        </div>

        <div className="mt-8 text-center">

          <button
            onClick={clearComparison}
            className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700"
          >
            Clear Comparison
          </button>

        </div>
      </>
    )}

  </section>

  {/* ================= FOOTER ================= */}

  <footer className="border-t bg-white px-4 py-8 text-center">

    <h3 className="text-xl font-bold text-blue-700">
      CollegeFinder
    </h3>

    <p className="mt-2 text-sm text-gray-500">
      Find. Compare. Choose your future.
    </p>

    <p className="mt-4 text-xs text-gray-400">
      © 2026 CollegeFinder. All rights reserved.
    </p>

  </footer>

</main>


);
}
