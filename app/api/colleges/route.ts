import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

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
  } finally {
    await prisma.$disconnect();
  }
}
