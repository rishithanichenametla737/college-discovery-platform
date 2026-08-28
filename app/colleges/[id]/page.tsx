"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const colleges = [
  {
    name: "ABC Engineering College",
    location: "Hyderabad",
    course: "Computer Science Engineering",
    fees: "₹1,20,000 / year",
    rating: "4.3 / 5",
    placement: "92%",
    hostel: "Available",
    type: "Private",
    exams: "JEE Main, TS EAMCET",
    recruiters: "TCS, Infosys, Wipro",
  },
  {
    name: "XYZ Institute of Technology",
    location: "Bangalore",
    course: "Information Technology",
    fees: "₹1,50,000 / year",
    rating: "4.5 / 5",
    placement: "94%",
    hostel: "Available",
    type: "Private",
    exams: "JEE Main, KCET",
    recruiters: "Google, Infosys, Accenture",
  },
  {
    name: "National Engineering College",
    location: "Chennai",
    course: "Computer Science Engineering",
    fees: "₹1,10,000 / year",
    rating: "4.2 / 5",
    placement: "90%",
    hostel: "Available",
    type: "Government",
    exams: "JEE Main, TNEA",
    recruiters: "TCS, Cognizant, Wipro",
  },
  {
    name: "Andhra Institute of Technology",
    location: "Anantapur",
    course: "Electronics and Communication Engineering",
    fees: "₹90,000 / year",
    rating: "4.1 / 5",
    placement: "88%",
    hostel: "Available",
    type: "Private",
    exams: "AP EAMCET",
    recruiters: "Infosys, Wipro, Tech Mahindra",
  },
  {
    name: "Delhi College of Engineering",
    location: "Delhi",
    course: "Mechanical Engineering",
    fees: "₹1,00,000 / year",
    rating: "4.4 / 5",
    placement: "91%",
    hostel: "Available",
    type: "Government",
    exams: "JEE Main",
    recruiters: "Microsoft, TCS, Deloitte",
  },
];

type Review = {
  rating: number;
  text: string;
};

export default function CollegeDetails() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);
  const college = colleges[id];

  // ================= REVIEWS =================

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const storageKey = `college-reviews-${id}`;

  // ================= LOAD REVIEWS =================

  useEffect(() => {
    if (!college) return;

    const savedReviews = localStorage.getItem(storageKey);

    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch {
        setReviews([]);
      }
    }
  }, [storageKey, college]);

  // ================= SUBMIT REVIEW =================

  const submitReview = () => {
    if (reviewText.trim() === "") {
      alert("Please write a review.");
      return;
    }

    const newReview: Review = {
      rating: reviewRating,
      text: reviewText.trim(),
    };

    const updatedReviews = [...reviews, newReview];

    setReviews(updatedReviews);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedReviews)
    );

    setReviewText("");
    setReviewRating(5);
  };

  // ================= DELETE REVIEW =================

  const deleteReview = (indexToDelete: number) => {
    const updatedReviews = reviews.filter(
      (_, index) => index !== indexToDelete
    );

    setReviews(updatedReviews);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedReviews)
    );
  };

  // ================= INVALID COLLEGE =================

  if (!college) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
          <div className="text-5xl">😕</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            College Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            The college you are looking for does not exist.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            ← Back to Colleges
          </button>
        </div>
      </main>
    );
  }

  // ================= AVERAGE REVIEW RATING =================

  const averageReviewRating =
    reviews.length === 0
      ? 0
      : reviews.reduce(
          (total, review) => total + review.rating,
          0
        ) / reviews.length;

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
            onClick={() => router.push("/#favorites")}
            className="hover:text-red-500"
          >
            ❤️ Favorites
          </button>

        </div>

      </nav>

      {/* ================= BACK BUTTON ================= */}

      <div className="mx-auto max-w-6xl px-6 pt-8">

        <button
          onClick={() => router.back()}
          className="rounded-xl bg-white px-5 py-3 font-medium text-gray-700 shadow-sm hover:bg-gray-100"
        >
          ← Back
        </button>

      </div>

      {/* ================= COLLEGE HEADER ================= */}

      <section className="mx-auto max-w-6xl px-6 py-10">

        <div className="rounded-3xl bg-white p-8 shadow-lg">

          <div className="flex flex-col gap-6 md:flex-row md:items-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-100 text-5xl">
              🎓
            </div>

            <div className="flex-1">

              <p className="font-semibold uppercase tracking-wider text-blue-600">
                College Details
              </p>

              <h1 className="mt-2 text-4xl font-bold text-gray-900">
                {college.name}
              </h1>

              <p className="mt-3 text-lg text-gray-600">
                📍 {college.location}
              </p>

            </div>

            <div className="rounded-2xl bg-yellow-50 px-6 py-5 text-center">

              <p className="text-sm text-gray-500">
                Rating
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                ⭐ {college.rating}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= OVERVIEW ================= */}

      <section className="mx-auto max-w-6xl px-6 pb-10">

        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          College Overview
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">📚</div>

            <p className="mt-4 text-sm text-gray-500">
              Course
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {college.course}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">💰</div>

            <p className="mt-4 text-sm text-gray-500">
              Annual Fees
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {college.fees}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">🏫</div>

            <p className="mt-4 text-sm text-gray-500">
              College Type
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {college.type}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">📊</div>

            <p className="mt-4 text-sm text-gray-500">
              Placement
            </p>

            <p className="mt-1 font-bold text-green-600">
              {college.placement}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">🏠</div>

            <p className="mt-4 text-sm text-gray-500">
              Hostel
            </p>

            <p className="mt-1 font-bold text-green-600">
              {college.hostel}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="text-3xl">📍</div>

            <p className="mt-4 text-sm text-gray-500">
              Location
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {college.location}
            </p>
          </div>

        </div>

      </section>

      {/* ================= ADMISSION ================= */}

      <section className="mx-auto max-w-6xl px-6 pb-10">

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl bg-white p-7 shadow-lg">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                🎯
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Entrance Exams
                </h2>

                <p className="text-sm text-gray-500">
                  Exams accepted for admission
                </p>
              </div>

            </div>

            <div className="mt-6 rounded-xl bg-purple-50 p-5">
              <p className="font-semibold text-purple-700">
                {college.exams}
              </p>
            </div>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
                💼
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Top Recruiters
                </h2>

                <p className="text-sm text-gray-500">
                  Companies hiring students
                </p>
              </div>

            </div>

            <div className="mt-6 rounded-xl bg-green-50 p-5">
              <p className="font-semibold text-green-700">
                {college.recruiters}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= WHY CHOOSE ================= */}

      <section className="mx-auto max-w-6xl px-6 pb-16">

        <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-lg">

          <h2 className="text-2xl font-bold">
            Why Consider {college.name}?
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl bg-white/10 p-5">
              <p className="text-2xl">⭐</p>

              <p className="mt-2 font-semibold">
                Good Rating
              </p>

              <p className="mt-1 text-sm text-blue-100">
                Rated {college.rating}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5">
              <p className="text-2xl">📊</p>

              <p className="mt-2 font-semibold">
                Strong Placement
              </p>

              <p className="mt-1 text-sm text-blue-100">
                {college.placement} placement rate
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5">
              <p className="text-2xl">🎯</p>

              <p className="mt-2 font-semibold">
                Admission Options
              </p>

              <p className="mt-1 text-sm text-blue-100">
                {college.exams}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* ================= REVIEWS SECTION ============== */}
      {/* ================================================= */}

      <section className="mx-auto max-w-6xl px-6 pb-16">

        <div className="rounded-3xl bg-white p-8 shadow-lg">

          {/* REVIEW TITLE */}

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Student Reviews
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              What Students Say
            </h2>

            <p className="mt-2 text-gray-600">
              Read reviews or share your own experience.
            </p>

          </div>

          {/* REVIEW SUMMARY */}

          <div className="mt-8 rounded-2xl bg-blue-50 p-6 text-center">

            {reviews.length === 0 ? (
              <>

                <p className="text-5xl">
                  ⭐
                </p>

                <h3 className="mt-3 text-xl font-bold text-gray-900">
                  No reviews yet
                </h3>

                <p className="mt-2 text-gray-600">
                  Be the first student to review this college.
                </p>

              </>
            ) : (
              <>

                <p className="text-5xl font-bold text-blue-700">
                  ⭐ {averageReviewRating.toFixed(1)}
                </p>

                <h3 className="mt-3 text-xl font-bold text-gray-900">
                  Average Student Rating
                </h3>

                <p className="mt-2 text-gray-600">
                  Based on {reviews.length} review
                  {reviews.length !== 1 ? "s" : ""}
                </p>

              </>
            )}

          </div>

          {/* ================= WRITE REVIEW ================= */}

          <div className="mt-8 rounded-2xl border border-gray-200 p-6">

            <h3 className="text-2xl font-bold text-gray-900">
              Write a Review
            </h3>

            <p className="mt-1 text-gray-500">
              Share your experience with other students.
            </p>

            {/* STAR RATING */}

            <div className="mt-6">

              <label className="font-semibold text-gray-700">
                Your Rating
              </label>

              <div className="mt-3 flex gap-2">

                {[1, 2, 3, 4, 5].map((star) => (

                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-4xl transition hover:scale-110 ${
                      star <= reviewRating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>

                ))}

              </div>

              <p className="mt-2 text-sm text-gray-500">
                You selected {reviewRating} out of 5
              </p>

            </div>

            {/* REVIEW TEXT */}

            <div className="mt-6">

              <label className="font-semibold text-gray-700">
                Your Review
              </label>

              <textarea
                value={reviewText}
                onChange={(e) =>
                  setReviewText(e.target.value)
                }
                placeholder="Write your experience about this college..."
                rows={5}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-1 text-right text-sm text-gray-400">
                {reviewText.length} characters
              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="button"
              onClick={submitReview}
              className="mt-5 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-md hover:bg-blue-700"
            >
              Submit Review
            </button>

          </div>

          {/* ================= DISPLAY REVIEWS ================= */}

          {reviews.length > 0 && (

            <div className="mt-10">

              <div className="flex items-center justify-between">

                <h3 className="text-2xl font-bold text-gray-900">
                  Student Reviews
                </h3>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  {reviews.length} Review
                  {reviews.length !== 1 ? "s" : ""}
                </span>

              </div>

              <div className="mt-5 space-y-4">

                {reviews.map((review, index) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="font-bold text-gray-900">
                          Student Review #{index + 1}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Student experience
                        </p>

                      </div>

                      <div className="flex items-center gap-4">

                        <div className="text-xl">
                          <span className="text-yellow-400">
                            {"★".repeat(review.rating)}
                          </span>

                          <span className="text-gray-300">
                            {"★".repeat(5 - review.rating)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteReview(index)
                          }
                          className="text-sm font-semibold text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                    <p className="mt-4 leading-relaxed text-gray-700">
                      {review.text}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </section>

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