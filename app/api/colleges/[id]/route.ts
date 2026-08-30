import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= GET ONE COLLEGE =================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: {
        id: collegeId,
      },
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("Error fetching college:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= UPDATE COLLEGE =================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
      );
    }

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

    if (!name || !location || !course) {
      return NextResponse.json(
        { error: "Name, location, and course are required" },
        { status: 400 }
      );
    }

    if (isNaN(fees) || fees < 0) {
      return NextResponse.json(
        { error: "Fees must be a valid positive number" },
        { status: 400 }
      );
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    if (isNaN(placement) || placement < 0 || placement > 100) {
      return NextResponse.json(
        { error: "Placement must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (!hostel || !type || !exams || !recruiters) {
      return NextResponse.json(
        { error: "Please fill in all college details" },
        { status: 400 }
      );
    }

    // ================= CHECK COLLEGE =================

    const existingCollege = await prisma.college.findUnique({
      where: {
        id: collegeId,
      },
    });

    if (!existingCollege) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // ================= UPDATE =================

    const updatedCollege = await prisma.college.update({
      where: {
        id: collegeId,
      },
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

    return NextResponse.json(updatedCollege);
  } catch (error) {
    console.error("Error updating college:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= DELETE COLLEGE =================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
      );
    }

    // ================= CHECK COLLEGE =================

    const existingCollege = await prisma.college.findUnique({
      where: {
        id: collegeId,
      },
    });

    if (!existingCollege) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // ================= DELETE =================

    await prisma.college.delete({
      where: {
        id: collegeId,
      },
    });

    return NextResponse.json({
      message: "College deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting college:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}