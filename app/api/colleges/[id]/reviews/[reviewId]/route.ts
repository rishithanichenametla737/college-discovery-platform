import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= UPDATE REVIEW =================

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; reviewId: string }>;
  }
) {
  try {
    const { id, reviewId } = await params;

    const collegeId = Number(id);
    const reviewIdNumber = Number(reviewId);

    // Validate IDs
    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
      );
    }

    if (isNaN(reviewIdNumber)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      );
    }

    // Get request data
    const body = await request.json();

    const rating = Number(body.rating);
    const comment = body.comment?.trim();

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

    // Check whether review exists
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewIdNumber,
        collegeId: collegeId,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewIdNumber,
      },
      data: {
        rating,
        comment,
      },
    });

    return NextResponse.json(updatedReview);

  } catch (error) {
    console.error("Error updating review:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= DELETE REVIEW =================

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; reviewId: string }>;
  }
) {
  try {
    const { id, reviewId } = await params;

    const collegeId = Number(id);
    const reviewIdNumber = Number(reviewId);

    // Validate IDs
    if (isNaN(collegeId)) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
      );
    }

    if (isNaN(reviewIdNumber)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      );
    }

    // Check whether review exists
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewIdNumber,
        collegeId: collegeId,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Delete review
    await prisma.review.delete({
      where: {
        id: reviewIdNumber,
      },
    });

    return NextResponse.json({
      message: "Review deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting review:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}