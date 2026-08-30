"use client";

import { useEffect, useState } from "react";
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

type CollegeForm = {
name: string;
location: string;
course: string;
fees: string;
rating: string;
placement: string;
hostel: string;
type: string;
exams: string;
recruiters: string;
};

const emptyForm: CollegeForm = {
name: "",
location: "",
course: "",
fees: "",
rating: "",
placement: "",
hostel: "Available",
type: "Private",
exams: "",
recruiters: "",
};

export default function ManageCollegesPage() {
const router = useRouter();

const [colleges, setColleges] = useState<College[]>([]);
const [searchTerm, setSearchTerm] = useState("");
const [form, setForm] = useState<CollegeForm>(emptyForm);
const [editingId, setEditingId] = useState<number | null>(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

useEffect(() => {
const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");


if (isAdminLoggedIn !== "true") {
  router.replace("/login");
  return;
}

loadColleges();


}, [router]);

async function loadColleges() {
try {
setLoading(true);


  const response = await fetch("/api/colleges");

  if (!response.ok) {
    throw new Error("Failed to load colleges");
  }

  const data = await response.json();

  setColleges(data);
} catch (error) {
  console.error(error);
  setMessage("Failed to load colleges");
} finally {
  setLoading(false);
}


}

function handleChange(
event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) {
const { name, value } = event.target;


setForm({
  ...form,
  [name]: value,
});


}

async function handleSubmit(
event: React.FormEvent<HTMLFormElement>
) {
event.preventDefault();


try {
  const collegeData = {
    name: form.name,
    location: form.location,
    course: form.course,
    fees: Number(form.fees),
    rating: Number(form.rating),
    placement: Number(form.placement),
    hostel: form.hostel,
    type: form.type,
    exams: form.exams,
    recruiters: form.recruiters,
  };

  let response;

  if (editingId !== null) {
    response = await fetch(`/api/colleges/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collegeData),
    });
  } else {
    response = await fetch("/api/colleges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collegeData),
    });
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  setMessage(
    editingId !== null
      ? "College updated successfully!"
      : "College added successfully!"
  );

  setForm(emptyForm);
  setEditingId(null);

  loadColleges();
} catch (error) {
  if (error instanceof Error) {
    setMessage(error.message);
  } else {
    setMessage("Something went wrong");
  }
}


}

function handleEdit(college: College) {
setEditingId(college.id);
setForm({
  name: college.name,
  location: college.location,
  course: college.course,
  fees: String(college.fees),
  rating: String(college.rating),
  placement: String(college.placement),
  hostel: college.hostel,
  type: college.type,
  exams: college.exams,
  recruiters: college.recruiters,
});

window.scrollTo({
  top: 0,
  behavior: "smooth",
});

}

function cancelEdit() {
setEditingId(null);
setForm(emptyForm);
setMessage("Edit cancelled");
}

async function handleDelete(id: number, name: string) {
const confirmed = window.confirm(
`Are you sure you want to delete ${name}?`
);

if (!confirmed) {
  return;
}

try {
  const response = await fetch(`/api/colleges/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete college");
  }

  setMessage("College deleted successfully!");

  loadColleges();
} catch (error) {
  if (error instanceof Error) {
    setMessage(error.message);
  } else {
    setMessage("Failed to delete college");
  }
}


}

const filteredColleges = colleges.filter((college) => {
const search = searchTerm.toLowerCase();


return (
  college.name.toLowerCase().includes(search) ||
  college.location.toLowerCase().includes(search) ||
  college.course.toLowerCase().includes(search)
);


});

return ( <main className="min-h-screen bg-gray-100"> <header className="bg-blue-700 px-6 py-5 text-white shadow"> <div className="mx-auto flex max-w-6xl items-center justify-between"> <div> <p className="text-sm font-semibold">ADMIN PANEL</p>


        <h1 className="text-2xl font-bold">
          Manage Colleges
        </h1>
      </div>

      <button
        onClick={() => router.push("/admin")}
        className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700"
      >
        ← Dashboard
      </button>
    </div>
  </header>

  <section className="mx-auto max-w-6xl px-6 py-10">
    {message && (
      <div className="mb-6 rounded-lg bg-blue-100 p-4 font-medium text-blue-700">
        {message}
      </div>
    )}

    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-gray-900">
        {editingId !== null
          ? "✏️ Edit College"
          : "➕ Add New College"}
      </h2>

      <p className="mt-2 text-gray-600">
        Enter all college details below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5 md:grid-cols-2"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="College Name"
          required
          className="rounded-lg border p-3"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="rounded-lg border p-3"
        />

        <input
          name="course"
          value={form.course}
          onChange={handleChange}
          placeholder="Course"
          required
          className="rounded-lg border p-3"
        />

        <input
          type="number"
          name="fees"
          value={form.fees}
          onChange={handleChange}
          placeholder="Annual Fees"
          required
          className="rounded-lg border p-3"
        />

        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          placeholder="Rating (0 - 5)"
          min="0"
          max="5"
          step="0.1"
          required
          className="rounded-lg border p-3"
        />

        <input
          type="number"
          name="placement"
          value={form.placement}
          onChange={handleChange}
          placeholder="Placement Percentage"
          min="0"
          max="100"
          required
          className="rounded-lg border p-3"
        />

        <select
          name="hostel"
          value={form.hostel}
          onChange={handleChange}
          className="rounded-lg border p-3"
        >
          <option value="Available">Hostel Available</option>
          <option value="Not Available">Hostel Not Available</option>
        </select>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="rounded-lg border p-3"
        >
          <option value="Private">Private College</option>
          <option value="Government">Government College</option>
        </select>

        <input
          name="exams"
          value={form.exams}
          onChange={handleChange}
          placeholder="Entrance Exams"
          required
          className="rounded-lg border p-3"
        />

        <input
          name="recruiters"
          value={form.recruiters}
          onChange={handleChange}
          placeholder="Top Recruiters"
          required
          className="rounded-lg border p-3"
        />

        <div className="flex gap-4 md:col-span-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700"
          >
            {editingId !== null
              ? "✏️ Update College"
              : "➕ Add College"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg bg-gray-500 px-6 py-3 font-bold text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>

    <section className="mt-8 rounded-2xl bg-white p-6 shadow">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            🏫 All Colleges
          </h2>

          <p className="mt-1 text-gray-600">
            Total Colleges: {colleges.length}
          </p>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="🔍 Search college, location, course..."
          className="w-full rounded-lg border p-3 md:w-96"
        />
      </div>

      {loading ? (
        <p className="mt-6 text-gray-600">
          Loading colleges...
        </p>
      ) : filteredColleges.length === 0 ? (
        <p className="mt-6 text-gray-600">
          No colleges found.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filteredColleges.map((college) => (
            <div
              key={college.id}
              className="rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900">
                {college.name}
              </h3>

              <p className="mt-3">
                📍 {college.location}
              </p>

              <p className="mt-2">
                📚 {college.course}
              </p>

              <p className="mt-2">
                💰 ₹{college.fees.toLocaleString("en-IN")} / year
              </p>

              <p className="mt-2">
                ⭐ {college.rating} / 5
              </p>

              <p className="mt-2">
                📊 Placement: {college.placement}%
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleEdit(college)}
                  className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-white"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(college.id, college.name)
                  }
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </section>
</main>


);
}
