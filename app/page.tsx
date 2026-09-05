"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type College = {
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
};

export default function Home() {
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] =
    useState("All Locations");
  const [courseFilter, setCourseFilter] =
    useState("All Courses");

  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);

  const [studentLoggedIn, setStudentLoggedIn] =
    useState(false);
  const [studentName, setStudentName] = useState("");

  /* ================= LOAD COLLEGES ================= */

  useEffect(() => {
    const loadColleges = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/colleges");

        if (!response.ok) {
          throw new Error("Failed to fetch colleges");
        }

        const data = await response.json();

        setColleges(data);
        setError("");
      } catch (error) {
        console.error("Error loading colleges:", error);
        setError(
          "Unable to load colleges. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadColleges();
  }, []);

  /* ================= LOAD LOCAL STORAGE ================= */

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(
        "college-favorites"
      );

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error(
        "Error loading favorites:",
        error
      );
    }

    const loggedIn =
      localStorage.getItem("studentLoggedIn") ===
      "true";

    const name =
      localStorage.getItem("studentName") || "";

    setStudentLoggedIn(loggedIn);
    setStudentName(name);
  }, []);

  /* ================= SAVE FAVORITES ================= */

  useEffect(() => {
    localStorage.setItem(
      "college-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  /* ================= UNIQUE FILTER VALUES ================= */

  const locations = useMemo(() => {
    return [
      "All Locations",
      ...Array.from(
        new Set(
          colleges.map(
            (college) => college.location
          )
        )
      ),
    ];
  }, [colleges]);

  const courses = useMemo(() => {
    return [
      "All Courses",
      ...Array.from(
        new Set(
          colleges.map(
            (college) => college.course
          )
        )
      ),
    ];
  }, [colleges]);

  /* ================= FILTER COLLEGES ================= */

  const filteredColleges = useMemo(() => {
    const query = search.trim().toLowerCase();

    return colleges.filter((college) => {
      const matchesSearch =
        query === "" ||
        college.name
          .toLowerCase()
          .includes(query) ||
        college.location
          .toLowerCase()
          .includes(query) ||
        college.course
          .toLowerCase()
          .includes(query);

      const matchesLocation =
        locationFilter === "All Locations" ||
        college.location === locationFilter;

      const matchesCourse =
        courseFilter === "All Courses" ||
        college.course === courseFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCourse
      );
    });
  }, [
    colleges,
    search,
    locationFilter,
    courseFilter,
  ]);

  /* ================= POPULAR COLLEGES ================= */

  const popularColleges = useMemo(() => {
    return [...colleges]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }, [colleges]);

  /* ================= FAVORITE COLLEGES ================= */

  const favoriteColleges = useMemo(() => {
    return colleges.filter((college) =>
      favorites.includes(college.id)
    );
  }, [colleges, favorites]);

  /* ================= FILTER ACTIVE ================= */

  const filtersActive =
    search.trim() !== "" ||
    locationFilter !== "All Locations" ||
    courseFilter !== "All Courses";

  /* ================= TOGGLE FAVORITE ================= */

  const toggleFavorite = (id: number) => {
    setFavorites((current) => {
      if (current.includes(id)) {
        return current.filter(
          (favoriteId) => favoriteId !== id
        );
      }

      return [...current, id];
    });
  };

  /* ================= TOGGLE COMPARE ================= */

  const toggleCompare = (id: number) => {
    setCompareList((current) => {
      if (current.includes(id)) {
        return current.filter(
          (collegeId) => collegeId !== id
        );
      }

      if (current.length >= 2) {
        alert(
          "You can compare up to 2 colleges."
        );
        return current;
      }

      return [...current, id];
    });
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("studentLoggedIn");
    localStorage.removeItem("studentName");

    setStudentLoggedIn(false);
    setStudentName("");

    alert("Logged out successfully.");
  };

  /* ================= FORMAT FEES ================= */

  const formatFees = (fees: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(fees);
  };

  /* ================= CLEAR FILTERS ================= */

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("All Locations");
    setCourseFilter("All Courses");
  };

  /* ================= COLLEGE CARD ================= */

  const CollegeCard = ({
    college,
  }: {
    college: College;
  }) => {
    const isFavorite = favorites.includes(
      college.id
    );

    const isCompared = compareList.includes(
      college.id
    );

    return (
      <article className="group overflow-hidden rounded-2xl border border-blue-200/10 bg-[#0d1d33] shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:border-blue-300/25 hover:bg-[#10233d]">

        {/* CARD TOP */}

        <div className="border-b border-blue-200/10 p-6">

          <div className="flex items-start justify-between gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-200/10 bg-[#142b49] text-xl">
              🎓
            </div>

            <button
              type="button"
              onClick={() =>
                toggleFavorite(college.id)
              }
              aria-label={
                isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition ${
                isFavorite
                  ? "border-blue-200/30 bg-white text-[#071426]"
                  : "border-blue-200/10 bg-[#142b49] text-white/50 hover:bg-[#1b3658] hover:text-white"
              }`}
            >
              {isFavorite ? "♥" : "♡"}
            </button>

          </div>

          <p className="mt-5 text-xs uppercase tracking-widest text-blue-200/45">
            {college.type}
          </p>

          <h3 className="mt-2 min-h-[56px] text-xl font-semibold leading-7 text-white">
            {college.name}
          </h3>

          <p className="mt-3 text-sm text-blue-100/55">
            📍 {college.location}
          </p>

        </div>

        {/* CARD STATS */}

        <div className="grid grid-cols-2 border-b border-blue-200/10">

          <div className="border-r border-blue-200/10 bg-[#0b192c] p-5">

            <p className="text-[10px] uppercase tracking-widest text-blue-100/35">
              Rating
            </p>

            <p className="mt-2 text-lg font-medium text-white">
              ⭐ {college.rating}
            </p>

          </div>

          <div className="bg-[#0b192c] p-5">

            <p className="text-[10px] uppercase tracking-widest text-blue-100/35">
              Placement
            </p>

            <p className="mt-2 text-lg font-medium text-white">
              {college.placement}%
            </p>

          </div>

        </div>

        {/* COURSE / FEES */}

        <div className="p-6">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-[10px] uppercase tracking-widest text-blue-100/35">
                Course
              </p>

              <p className="mt-2 text-sm font-medium text-blue-50/85">
                {college.course}
              </p>

            </div>

            <div className="text-right">

              <p className="text-[10px] uppercase tracking-widest text-blue-100/35">
                Fees
              </p>

              <p className="mt-2 text-sm font-medium text-blue-50/85">
                {formatFees(college.fees)}
              </p>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="mt-6 flex gap-2">

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/colleges/${college.id}`
                )
              }
              className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#071426] transition hover:bg-blue-50"
            >
              View Details
            </button>

            <button
              type="button"
              onClick={() =>
                toggleCompare(college.id)
              }
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                isCompared
                  ? "border-white bg-white text-[#071426]"
                  : "border-blue-200/10 bg-[#142b49] text-blue-50/70 hover:bg-[#1b3658] hover:text-white"
              }`}
            >
              {isCompared
                ? "✓ Compare"
                : "Compare"}
            </button>

          </div>

        </div>

      </article>
    );
  };

  return (
    <main className="min-h-screen bg-[#071426] text-white">

      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <nav className="sticky top-0 z-50 border-b border-blue-200/10 bg-[#071426]/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          {/* LOGO */}

          <button
            onClick={() => router.push("/")}
            className="text-lg font-semibold tracking-tight text-white"
          >
            College
            <span className="text-blue-200/55">
              Finder
            </span>
          </button>

          {/* NAV LINKS */}

          <div className="hidden items-center gap-7 text-sm text-blue-100/55 md:flex">

            <button
              onClick={() => router.push("/")}
              className="transition hover:text-white"
            >
              Home
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("colleges")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="transition hover:text-white"
            >
              Colleges
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("comparison")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="transition hover:text-white"
            >
              Compare
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("favorites")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="transition hover:text-white"
            >
              Favorites
            </button>

          </div>

          {/* AUTH */}

          <div className="flex items-center gap-2">

            {studentLoggedIn ? (
              <>
                <span className="hidden rounded-lg border border-blue-200/10 bg-[#0d1d33] px-3 py-2 text-xs text-blue-100/65 sm:block">
                  Hi, {studentName}
                </span>

                <button
                  onClick={logout}
                  className="rounded-lg border border-blue-200/10 bg-[#0d1d33] px-3 py-2 text-xs font-medium text-blue-100/65 transition hover:bg-[#142b49] hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    router.push(
                      "/student-login"
                    )
                  }
                  className="rounded-lg border border-blue-200/10 bg-[#0d1d33] px-3 py-2 text-xs font-medium text-blue-100/65 transition hover:bg-[#142b49] hover:text-white"
                >
                  Student Login
                </button>

                <button
                  onClick={() =>
                    router.push("/register")
                  }
                  className="hidden rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#071426] transition hover:bg-blue-50 sm:block"
                >
                  Register
                </button>
              </>
            )}

          </div>

        </div>

      </nav>

      {/* ================================================== */}
      {/* HERO */}
      {/* ================================================== */}

      <section className="relative overflow-hidden border-b border-blue-200/10 bg-[#071426]">

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-400/[0.08] blur-3xl" />

          <div className="absolute -left-40 top-40 h-72 w-72 rounded-full bg-indigo-400/[0.05] blur-3xl" />

          <div className="absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-blue-300/[0.04] blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">

          <div className="max-w-4xl">

            <div className="mb-6 flex flex-wrap gap-2">

              <span className="rounded-full border border-blue-200/15 bg-[#10233d] px-3 py-1 text-xs uppercase tracking-widest text-blue-100/60">
                College Discovery Platform
              </span>

              <span className="rounded-full border border-blue-200/10 bg-[#0d1d33] px-3 py-1 text-xs text-blue-100/45">
                Discover • Compare • Choose
              </span>

            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-7xl">

              Find the right college

              <span className="block text-blue-100/45">
                for your future.
              </span>

            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-blue-100/55 md:text-base">
              Explore colleges, compare courses,
              review placement information, and
              discover options that match your
              goals.
            </p>

          </div>

          {/* SEARCH */}

          <div className="mt-10 max-w-5xl rounded-2xl border border-blue-200/10 bg-[#0d1d33] p-3 shadow-[0_15px_50px_rgba(0,0,0,0.25)]">

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-100/35">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search colleges, courses, or cities..."
                  className="w-full rounded-xl border border-blue-200/10 bg-[#071426] px-11 py-4 text-sm text-white outline-none placeholder:text-blue-100/25 focus:border-blue-200/30 focus:ring-1 focus:ring-blue-200/10"
                />

              </div>

              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-blue-200/10 bg-[#071426] px-4 py-4 text-sm text-blue-50/75 outline-none focus:border-blue-200/30"
              >

                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                    className="bg-[#071426]"
                  >
                    {location}
                  </option>
                ))}

              </select>

              <select
                value={courseFilter}
                onChange={(e) =>
                  setCourseFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-blue-200/10 bg-[#071426] px-4 py-4 text-sm text-blue-50/75 outline-none focus:border-blue-200/30"
              >

                {courses.map((course) => (
                  <option
                    key={course}
                    value={course}
                    className="bg-[#071426]"
                  >
                    {course}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* QUICK STATS */}

          <div className="mt-8 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-blue-200/10 bg-blue-200/10 md:grid-cols-4">

            <div className="bg-[#0b192c] p-5">

              <p className="text-xs uppercase tracking-widest text-blue-100/35">
                Colleges
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {colleges.length}
              </p>

            </div>

            <div className="bg-[#0b192c] p-5">

              <p className="text-xs uppercase tracking-widest text-blue-100/35">
                Locations
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {Math.max(
                  locations.length - 1,
                  0
                )}
              </p>

            </div>

            <div className="bg-[#0b192c] p-5">

              <p className="text-xs uppercase tracking-widest text-blue-100/35">
                Courses
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {Math.max(
                  courses.length - 1,
                  0
                )}
              </p>

            </div>

            <div className="bg-[#0b192c] p-5">

              <p className="text-xs uppercase tracking-widest text-blue-100/35">
                Favorites
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {favorites.length}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* POPULAR COLLEGES */}
      {/* ================================================== */}

      {!filtersActive && (
        <section
          id="colleges"
          className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20"
        >

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-blue-200/40">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Popular Colleges
              </h2>

              <p className="mt-3 text-sm text-blue-100/45">
                Highly rated colleges from the
                platform.
              </p>

            </div>

            <button
              onClick={() =>
                document
                  .getElementById(
                    "all-colleges"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="w-fit rounded-lg border border-blue-200/10 bg-[#0d1d33] px-4 py-2 text-xs font-medium text-blue-100/65 transition hover:bg-[#142b49] hover:text-white"
            >
              View all colleges ↓
            </button>

          </div>

          {loading ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[360px] animate-pulse rounded-2xl border border-blue-200/10 bg-[#0d1d33]"
                />
              ))}
            </div>
          ) : popularColleges.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-blue-200/10 bg-[#0d1d33] p-10 text-center">

              <p className="text-3xl">🎓</p>

              <h3 className="mt-4 text-lg font-medium">
                No colleges available
              </h3>

              <p className="mt-2 text-sm text-blue-100/45">
                College information will
                appear here once available.
              </p>

            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {popularColleges.map(
                (college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                  />
                )
              )}
            </div>
          )}

        </section>
      )}

      {/* ================================================== */}
      {/* ALL COLLEGES */}
      {/* ================================================== */}

      <section
        id="all-colleges"
        className="border-t border-blue-200/10"
      >

        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-blue-200/40">
                Directory
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {filtersActive
                  ? "Search Results"
                  : "All Colleges"}
              </h2>

              <p className="mt-3 text-sm text-blue-100/45">
                Showing{" "}
                {filteredColleges.length}{" "}
                of {colleges.length}{" "}
                colleges.
              </p>

            </div>

            {filtersActive && (
              <button
                onClick={clearFilters}
                className="w-fit rounded-lg border border-blue-200/10 bg-[#0d1d33] px-4 py-2 text-xs font-medium text-blue-100/65 transition hover:bg-[#142b49] hover:text-white"
              >
                Clear Filters
              </button>
            )}

          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-300/10 bg-red-950/20 p-10 text-center">

              <p className="text-3xl">⚠️</p>

              <h3 className="mt-4 text-lg font-medium">
                Something went wrong
              </h3>

              <p className="mt-2 text-sm text-blue-100/45">
                {error}
              </p>

              <button
                onClick={() =>
                  window.location.reload()
                }
                className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#071426]"
              >
                Try Again
              </button>

            </div>
          ) : loading ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[360px] animate-pulse rounded-2xl border border-blue-200/10 bg-[#0d1d33]"
                  />
                )
              )}
            </div>
          ) : filteredColleges.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-blue-200/10 bg-[#0d1d33] p-12 text-center">

              <div className="text-4xl">⌕</div>

              <h3 className="mt-5 text-xl font-semibold">
                No colleges found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-blue-100/45">
                Try changing your search
                term or removing one of the
                filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#071426]"
              >
                Reset Search
              </button>

            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredColleges.map(
                (college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                  />
                )
              )}
            </div>
          )}

        </div>

      </section>

      {/* ================================================== */}
      {/* COMPARISON */}
      {/* ================================================== */}

      <section
        id="comparison"
        className="border-t border-blue-200/10"
      >

        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-blue-200/40">
              Compare
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              College Comparison
            </h2>

            <p className="mt-3 text-sm text-blue-100/45">
              Select up to two colleges to
              compare their key information.
            </p>

          </div>

          {compareList.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-blue-200/10 bg-[#0d1d33] p-10 text-center">

              <div className="text-3xl">⚖️</div>

              <h3 className="mt-4 text-lg font-medium">
                Nothing selected
              </h3>

              <p className="mt-2 text-sm text-blue-100/35">
                Select the Compare button on a
                college card.
              </p>

            </div>
          ) : (
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-blue-200/10 bg-blue-200/10 md:grid-cols-2">

              {compareList.map((id) => {

                const college =
                  colleges.find(
                    (item) =>
                      item.id === id
                  );

                if (!college) return null;

                return (
                  <div
                    key={college.id}
                    className="bg-[#0d1d33] p-7"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-xs uppercase tracking-widest text-blue-200/35">
                          College
                        </p>

                        <h3 className="mt-2 text-xl font-semibold">
                          {college.name}
                        </h3>

                        <p className="mt-2 text-sm text-blue-100/40">
                          📍 {college.location}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          toggleCompare(
                            college.id
                          )
                        }
                        className="rounded-lg border border-blue-200/10 bg-[#142b49] px-3 py-2 text-xs text-blue-100/55 transition hover:bg-[#1b3658] hover:text-white"
                      >
                        Remove
                      </button>

                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-blue-200/10 bg-blue-200/10">

                      <div className="bg-[#0b192c] p-4">

                        <p className="text-[10px] uppercase tracking-widest text-blue-100/30">
                          Rating
                        </p>

                        <p className="mt-2 font-medium">
                          ⭐ {college.rating}
                        </p>

                      </div>

                      <div className="bg-[#0b192c] p-4">

                        <p className="text-[10px] uppercase tracking-widest text-blue-100/30">
                          Placement
                        </p>

                        <p className="mt-2 font-medium">
                          {college.placement}%
                        </p>

                      </div>

                      <div className="bg-[#0b192c] p-4">

                        <p className="text-[10px] uppercase tracking-widest text-blue-100/30">
                          Fees
                        </p>

                        <p className="mt-2 text-sm font-medium">
                          {formatFees(
                            college.fees
                          )}
                        </p>

                      </div>

                      <div className="bg-[#0b192c] p-4">

                        <p className="text-[10px] uppercase tracking-widest text-blue-100/30">
                          Hostel
                        </p>

                        <p className="mt-2 text-sm font-medium">
                          {college.hostel}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          `/colleges/${college.id}`
                        )
                      }
                      className="mt-5 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#071426] transition hover:bg-blue-50"
                    >
                      View Full Details
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </section>

      {/* ================================================== */}
      {/* FAVORITES */}
      {/* ================================================== */}

      <section
        id="favorites"
        className="border-t border-blue-200/10"
      >

        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">

          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-blue-200/40">
              Saved
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Your Favorites
            </h2>

            <p className="mt-3 text-sm text-blue-100/45">
              Colleges you saved for later.
            </p>

          </div>

          {favoriteColleges.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-blue-200/10 bg-[#0d1d33] p-10 text-center">

              <div className="text-3xl">♡</div>

              <h3 className="mt-4 text-lg font-medium">
                No favorites yet
              </h3>

              <p className="mt-2 text-sm text-blue-100/35">
                Save colleges from the cards
                above to see them here.
              </p>

            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {favoriteColleges.map(
                (college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                  />
                )
              )}

            </div>
          )}

        </div>

      </section>

      {/* ================================================== */}
      {/* FINAL CTA */}
      {/* ================================================== */}

      <section className="border-t border-blue-200/10">

        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">

          <div className="rounded-3xl border border-blue-200/10 bg-[#0d1d33] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] md:p-14">

            <p className="text-xs uppercase tracking-[0.2em] text-blue-200/40">
              Start Exploring
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
              Your next opportunity could
              start with the right college.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-blue-100/45">
              Search colleges, compare your
              options, and make a more informed
              decision about your future.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("colleges")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="mt-7 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#071426] transition hover:bg-blue-50"
            >
              Explore Colleges
            </button>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <footer className="border-t border-blue-200/10 bg-[#061222]">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-center md:flex-row md:items-center md:justify-between md:px-8 md:text-left">

          <div>

            <p className="font-semibold">
              College
              <span className="text-blue-200/50">
                Finder
              </span>
            </p>

            <p className="mt-1 text-xs text-blue-100/30">
              Find. Compare. Choose your future.
            </p>

          </div>

          <div className="text-xs text-blue-100/25">
            © 2026 CollegeFinder. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}