import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= GET COLLEGES =================

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      orderBy: {
        rating: "desc",
      },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.error("Error fetching colleges:", error);

    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}

// ================= ADD COLLEGE =================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const location = body.location?.trim();
    const course = body.course?.trim();
    const fees = Number(body.fees);
    const rating = Number(body.rating);
    const placement = Number(body.placement);
    const hostel = body.hostel?.trim();
    const type = body.type?.trim();
    const exams = body.exams?.trim();
    const recruiters = body.recruiters?.trim();

    // ================= VALIDATION =================

    if (!name) {
      return NextResponse.json(
        { error: "College name is required" },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    if (!course) {
      return NextResponse.json(
        { error: "Course is required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(fees) || fees <= 0) {
      return NextResponse.json(
        { error: "Fees must be greater than 0" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(placement) || placement < 0 || placement > 100) {
      return NextResponse.json(
        { error: "Placement must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (!hostel) {
      return NextResponse.json(
        { error: "Hostel information is required" },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "College type is required" },
        { status: 400 }
      );
    }

    if (!exams) {
      return NextResponse.json(
        { error: "Entrance exams are required" },
        { status: 400 }
      );
    }

    if (!recruiters) {
      return NextResponse.json(
        { error: "Recruiters information is required" },
        { status: 400 }
      );
    }

    // ================= CREATE COLLEGE =================

    const college = await prisma.college.create({
      data: {
        name,
        location,
        course,
        fees,
        rating,
        placement,
        hostel,
        type,
        exams,
        recruiters,
      },
    });

    return NextResponse.json(college, {
      status: 201,
    });
  } catch (error) {
    console.error("Error adding college:", error);

    return NextResponse.json(
      { error: "Failed to add college" },
      { status: 500 }
    );
  }
}