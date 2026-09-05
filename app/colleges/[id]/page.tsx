"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

type Review = {
  id: number;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export default function CollegeDetails() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [college, setCollege] = useState<College | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ADD REVIEW
  const [studentName, setStudentName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // EDIT REVIEW
  const [editingReviewId, setEditingReviewId] =
    useState<number | null>(null);

  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState("");

  // ================= LOAD COLLEGE =================

  useEffect(() => {
    if (!id) return;

    const loadCollege = async () => {
      try {
        const response = await fetch(`/api/colleges/${id}`);

        if (!response.ok) {
          setCollege(null);
          return;
        }

        const data = await response.json();
        setCollege(data);
      } catch (error) {
        console.error("Error loading college:", error);
        setCollege(null);
      } finally {
        setLoading(false);
      }
    };

    loadCollege();
  }, [id]);

  // ================= LOAD REVIEWS =================

  useEffect(() => {
    if (!id) return;

    const loadReviews = async () => {
      try {
        const response = await fetch(`/api/colleges/${id}/reviews`);

        if (!response.ok) return;

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    };

    loadReviews();
  }, [id]);

  // ================= SUBMIT REVIEW =================

  const submitReview = async () => {
    if (studentName.trim() === "") {
      alert("Please enter your name.");
      return;
    }

    if (reviewText.trim() === "") {
      alert("Please write a review.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`/api/colleges/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          rating: reviewRating,
          comment: reviewText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to submit review.");
        return;
      }

      setReviews((currentReviews) => [data, ...currentReviews]);

      setStudentName("");
      setReviewText("");
      setReviewRating(5);

      alert("Review submitted successfully! 🎉");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= START EDIT =================

  const startEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditText(review.comment);
  };

  // ================= CANCEL EDIT =================

  const cancelEditReview = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditText("");
  };

  // ================= UPDATE REVIEW =================

  const updateReview = async (reviewId: number) => {
    if (editText.trim() === "") {
      alert("Please write a review.");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `/api/colleges/${id}/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: editRating,
            comment: editText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update review.");
        return;
      }

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId ? data : review
        )
      );

      setEditingReviewId(null);
      setEditRating(5);
      setEditText("");

      alert("Review updated successfully! 🎉");
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // ================= DELETE REVIEW =================

  const deleteReview = async (reviewId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/colleges/${id}/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete review.");
        return;
      }

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId)
      );

      alert("Review deleted successfully! 🗑️");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071426] text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-[#0d1d33] text-3xl shadow-[0_0_40px_rgba(59,130,246,0.12)]">
            🎓
          </div>

          <p className="mt-5 text-sm text-blue-100/60">
            Loading college details...
          </p>
        </div>
      </main>
    );
  }

  // ================= NOT FOUND =================

  if (!college) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071426] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-blue-400/10 bg-[#0d1d33] p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
          <div className="text-5xl">😕</div>

          <h1 className="mt-5 text-2xl font-semibold">
            College Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-blue-100/50">
            The college you are looking for does not exist or
            may have been removed.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-7 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            ← Back to Colleges
          </button>
        </div>
      </main>
    );
  }

  // ================= CALCULATIONS =================

  const averageReviewRating =
    reviews.length === 0
      ? 0
      : reviews.reduce(
          (total, review) => total + review.rating,
          0
        ) / reviews.length;

  const formattedFees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(college.fees);

  return (
    <main className="min-h-screen bg-[#071426] text-white">

      {/* BLUE BACKGROUND GLOW */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute right-[-180px] top-[280px] h-[400px] w-[400px] rounded-full bg-cyan-400/5 blur-[120px]" />
      </div>

      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 border-b border-blue-200/10 bg-[#071426]/90 px-5 py-4 backdrop-blur-xl md:px-8">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <button
            onClick={() => router.push("/")}
            className="text-lg font-semibold tracking-tight text-white"
          >
            College<span className="text-blue-300">Finder</span>
          </button>

          <div className="hidden items-center gap-7 text-sm text-blue-100/55 md:flex">

            <button
              onClick={() => router.push("/")}
              className="transition hover:text-white"
            >
              Home
            </button>

            <button
              onClick={() => router.push("/#colleges")}
              className="transition hover:text-white"
            >
              Colleges
            </button>

            <button
              onClick={() => router.push("/#comparison")}
              className="transition hover:text-white"
            >
              Compare
            </button>

            <button
              onClick={() => router.push("/#favorites")}
              className="transition hover:text-white"
            >
              Favorites
            </button>

          </div>

          <button
            onClick={() => router.back()}
            className="rounded-xl border border-blue-200/10 bg-[#0d1d33] px-4 py-2 text-xs font-medium text-blue-100/70 transition hover:border-blue-400/30 hover:bg-[#142b49] hover:text-white"
          >
            ← Back
          </button>

        </div>

      </nav>

      {/* ================= PAGE ================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">

        {/* ================= HERO ================= */}

        <section className="border-b border-blue-200/10 py-12 md:py-16">

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <div className="mb-5 flex flex-wrap items-center gap-2">

                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                  College Details
                </span>

                <span className="rounded-full border border-blue-200/10 bg-[#0d1d33] px-3 py-1 text-xs text-blue-100/55">
                  {college.type}
                </span>

              </div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {college.name}
              </h1>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100/55">

                <span>📍 {college.location}</span>

                <span>📚 {college.course}</span>

              </div>

            </div>

            <div className="rounded-2xl border border-blue-400/15 bg-[#0d1d33] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.2)] lg:min-w-[190px]">

              <p className="text-xs uppercase tracking-widest text-blue-200/40">
                College Rating
              </p>

              <div className="mt-3 flex items-end gap-2">

                <span className="text-4xl font-semibold text-white">
                  {college.rating}
                </span>

                <span className="pb-1 text-sm text-blue-100/40">
                  / 5
                </span>

              </div>

              <div className="mt-2 text-sm text-blue-200/70">
                ⭐ Excellent rating
              </div>

            </div>

          </div>

        </section>

        {/* ================= OVERVIEW ================= */}

        <section className="py-12">

          <div className="mb-7">

            <p className="text-xs uppercase tracking-[0.2em] text-blue-300/50">
              Overview
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              College at a glance
            </h2>

          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-blue-200/10 bg-blue-200/10 sm:grid-cols-2 lg:grid-cols-3">

            {[
              ["Course", college.course, "Available program"],
              ["Annual Fees", formattedFees, "Estimated yearly fee"],
              ["Placement", `${college.placement}%`, "Placement rate"],
              ["Hostel", college.hostel, "Hostel availability"],
              ["College Type", college.type, "Institution category"],
              ["Location", college.location, "Campus location"],
            ].map(([label, value, description]) => (

              <div
                key={label}
                className="bg-[#0b192c] p-6 transition hover:bg-[#10233d]"
              >

                <p className="text-xs uppercase tracking-widest text-blue-200/40">
                  {label}
                </p>

                <p className="mt-3 text-lg font-medium text-white">
                  {value}
                </p>

                <p className="mt-2 text-sm text-blue-100/40">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* ================= ADMISSION + RECRUITERS ================= */}

        <section className="pb-12">

          <div className="grid gap-5 lg:grid-cols-2">

            <div className="rounded-2xl border border-blue-200/10 bg-[#0d1d33] p-7 transition hover:border-blue-400/25">

              <p className="text-xs uppercase tracking-[0.2em] text-blue-300/50">
                Admissions
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Entrance Exams
              </h2>

              <p className="mt-2 text-sm text-blue-100/45">
                Exams accepted for admission
              </p>

              <div className="mt-7 rounded-xl border border-blue-200/10 bg-[#0b192c] p-5">

                <p className="text-sm leading-6 text-blue-50/80">
                  {college.exams}
                </p>

              </div>

            </div>

            <div className="rounded-2xl border border-blue-200/10 bg-[#0d1d33] p-7 transition hover:border-blue-400/25">

              <p className="text-xs uppercase tracking-[0.2em] text-blue-300/50">
                Career
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Top Recruiters
              </h2>

              <p className="mt-2 text-sm text-blue-100/45">
                Companies hiring students
              </p>

              <div className="mt-7 rounded-xl border border-blue-200/10 bg-[#0b192c] p-5">

                <p className="text-sm leading-6 text-blue-50/80">
                  {college.recruiters}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================= HIGHLIGHTS ================= */}

        <section className="pb-12">

          <div className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-[#142b49] to-[#0d1d33] p-8 shadow-[0_20px_70px_rgba(37,99,235,0.08)]">

            <p className="text-xs uppercase tracking-[0.2em] text-blue-300/50">
              Highlights
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Why consider {college.name}?
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              {[
                [
                  "⭐",
                  "Strong Rating",
                  `Rated ${college.rating} out of 5 by the platform.`,
                ],
                [
                  "📈",
                  "Placement Focus",
                  `${college.placement}% reported placement rate.`,
                ],
                [
                  "🎯",
                  "Admission Route",
                  `Admission through ${college.exams}.`,
                ],
              ].map(([icon, title, description]) => (

                <div
                  key={title}
                  className="rounded-xl border border-blue-200/10 bg-[#0b192c]/80 p-5 transition hover:-translate-y-1 hover:border-blue-400/25"
                >

                  <div className="text-xl">{icon}</div>

                  <h3 className="mt-4 font-medium">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-blue-100/45">
                    {description}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* ================= REVIEWS ================= */}

        <section className="pb-16">

          <div className="border-t border-blue-200/10 pt-12">

            <div className="max-w-2xl">

              <p className="text-xs uppercase tracking-[0.2em] text-blue-300/50">
                Community
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                Student Reviews
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100/45">
                Read experiences from students or share your own
                experience with this college.
              </p>

            </div>

            {/* REVIEW SUMMARY */}

            <div className="mt-8 rounded-2xl border border-blue-200/10 bg-[#0d1d33] p-7">

              {reviews.length === 0 ? (
                <div>

                  <div className="text-3xl">⭐</div>

                  <h3 className="mt-4 text-lg font-medium">
                    No reviews yet
                  </h3>

                  <p className="mt-2 text-sm text-blue-100/45">
                    Be the first student to review this college.
                  </p>

                </div>
              ) : (
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-widest text-blue-200/40">
                      Average Rating
                    </p>

                    <p className="mt-2 text-4xl font-semibold">
                      {averageReviewRating.toFixed(1)}
                      <span className="ml-2 text-base text-blue-100/35">
                        / 5
                      </span>
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-sm text-blue-100/60">
                      ⭐ {reviews.length} student review
                      {reviews.length !== 1 ? "s" : ""}
                    </p>

                    <p className="mt-1 text-xs text-blue-100/35">
                      Based on community feedback
                    </p>

                  </div>

                </div>
              )}

            </div>

            {/* WRITE REVIEW */}

            <div className="mt-6 rounded-2xl border border-blue-200/10 bg-[#0d1d33] p-7">

              <h3 className="text-xl font-semibold">
                Write a Review
              </h3>

              <p className="mt-2 text-sm text-blue-100/45">
                Share your experience with other students.
              </p>

              {/* NAME */}

              <div className="mt-7">

                <label className="text-sm font-medium text-blue-50/80">
                  Your Name
                </label>

                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name..."
                  disabled={submitting}
                  className="mt-2 w-full rounded-xl border border-blue-200/10 bg-[#071426] px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/25 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-50"
                />

              </div>

              {/* RATING */}

              <div className="mt-6">

                <label className="text-sm font-medium text-blue-50/80">
                  Your Rating
                </label>

                <div className="mt-3 flex gap-1">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl transition hover:scale-110 ${
                        star <= reviewRating
                          ? "text-blue-300"
                          : "text-blue-100/15"
                      }`}
                    >
                      ★
                    </button>
                  ))}

                </div>

                <p className="mt-2 text-xs text-blue-100/35">
                  {reviewRating} out of 5
                </p>

              </div>

              {/* COMMENT */}

              <div className="mt-6">

                <label className="text-sm font-medium text-blue-50/80">
                  Your Review
                </label>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your experience about this college..."
                  rows={5}
                  disabled={submitting}
                  className="mt-2 w-full resize-none rounded-xl border border-blue-200/10 bg-[#071426] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-blue-100/25 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-50"
                />

                <div className="mt-2 text-right text-xs text-blue-100/25">
                  {reviewText.length} characters
                </div>

              </div>

              <button
                type="button"
                onClick={submitReview}
                disabled={submitting}
                className="mt-5 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>

            </div>

            {/* REVIEW LIST */}

            {reviews.length > 0 && (

              <div className="mt-8">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                  <h3 className="text-xl font-semibold">
                    Recent Reviews
                  </h3>

                  <span className="rounded-full border border-blue-200/10 bg-[#0d1d33] px-3 py-1 text-xs text-blue-100/50">
                    {reviews.length} review
                    {reviews.length !== 1 ? "s" : ""}
                  </span>

                </div>

                <div className="space-y-4">

                  {reviews.map((review, index) => (

                    <div
                      key={review.id}
                      className="rounded-2xl border border-blue-200/10 bg-[#0d1d33] p-6 transition hover:border-blue-400/25 hover:bg-[#10233d]"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">

                            <p className="font-medium">
                              {review.studentName ||
                                "Anonymous Student"}
                            </p>

                            <span className="text-xs text-blue-100/25">
                              Review #{index + 1}
                            </span>

                          </div>

                          <p className="mt-2 text-xs text-blue-100/35">
                            Posted{" "}
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>

                          {editingReviewId !== review.id && (

                            <div className="mt-4 text-lg tracking-wide">

                              <span className="text-blue-300">
                                {"★".repeat(review.rating)}
                              </span>

                              <span className="text-blue-100/15">
                                {"★".repeat(5 - review.rating)}
                              </span>

                            </div>

                          )}

                        </div>

                        {editingReviewId !== review.id && (

                          <div className="flex gap-2">

                            <button
                              type="button"
                              onClick={() => startEditReview(review)}
                              className="rounded-lg border border-blue-200/10 bg-[#142b49] px-3 py-2 text-xs font-medium text-blue-100/70 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteReview(review.id)}
                              className="rounded-lg border border-blue-200/10 bg-[#142b49] px-3 py-2 text-xs font-medium text-blue-100/50 transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-white"
                            >
                              Delete
                            </button>

                          </div>

                        )}

                      </div>

                      {/* EDIT MODE */}

                      {editingReviewId === review.id ? (

                        <div className="mt-6 border-t border-blue-200/10 pt-6">

                          <label className="text-sm font-medium text-blue-50/80">
                            Change Rating
                          </label>

                          <div className="mt-3 flex gap-1">

                            {[1, 2, 3, 4, 5].map((star) => (

                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditRating(star)}
                                className={`text-3xl transition hover:scale-110 ${
                                  star <= editRating
                                    ? "text-blue-300"
                                    : "text-blue-100/15"
                                }`}
                              >
                                ★
                              </button>

                            ))}

                          </div>

                          <p className="mt-2 text-xs text-blue-100/35">
                            {editRating} out of 5
                          </p>

                          <label className="mt-6 block text-sm font-medium text-blue-50/80">
                            Change Review
                          </label>

                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={5}
                            disabled={updating}
                            className="mt-2 w-full resize-none rounded-xl border border-blue-200/10 bg-[#071426] px-4 py-3 text-sm leading-6 text-white outline-none focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-50"
                          />

                          <div className="mt-5 flex flex-wrap gap-3">

                            <button
                              type="button"
                              onClick={() => updateReview(review.id)}
                              disabled={updating}
                              className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-40"
                            >
                              {updating
                                ? "Updating..."
                                : "Update Review"}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditReview}
                              disabled={updating}
                              className="rounded-xl border border-blue-200/10 bg-[#142b49] px-5 py-3 text-sm font-medium text-blue-100/70 transition hover:bg-[#19385d] disabled:opacity-40"
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      ) : (

                        <p className="mt-5 max-w-4xl text-sm leading-7 text-blue-100/60">
                          {review.comment}
                        </p>

                      )}

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

        </section>

      </div>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-blue-200/10 bg-[#061222] px-5 py-10 md:px-8">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">

          <div>

            <p className="font-semibold">
              College<span className="text-blue-300">
                Finder
              </span>
            </p>

            <p className="mt-1 text-xs text-blue-100/30">
              Find. Compare. Choose your future.
            </p>

          </div>

          <p className="text-xs text-blue-100/25">
            © 2026 CollegeFinder. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}