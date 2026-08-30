import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= GET REVIEWS FOR A COLLEGE =================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    const reviews = await prisma.review.findMany({
      where: {
        collegeId: collegeId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= ADD A NEW REVIEW =================

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    const body = await request.json();

    // Get data from frontend
    const studentName = body.studentName?.trim();
    const rating = Number(body.rating);
    const comment = body.comment?.trim();

    // Validate student name
    if (!studentName) {
      return NextResponse.json(
        { error: "Student name is required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate comment
    if (!comment) {
      return NextResponse.json(
        { error: "Review comment is required" },
        { status: 400 }
      );
    }

    // Check if college exists
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

    // Create review
    const review = await prisma.review.create({
      data: {
        studentName,
        rating,
        comment,
        collegeId,
      },
    });

    return NextResponse.json(review, {
      status: 201,
    });

  } catch (error) {
    console.error("Error creating review:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}