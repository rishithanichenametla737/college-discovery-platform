import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Delete existing reviews first because they depend on colleges
  await prisma.review.deleteMany();

  // Delete existing colleges
  await prisma.college.deleteMany();

  // Add colleges
  await prisma.college.createMany({
    data: [
      {
        name: "Indian Institute of Technology Hyderabad",
        location: "Hyderabad, Telangana",
        course: "B.Tech Computer Science",
        fees: 250000,
        rating: 4.8,
        placement: 95,
        hostel: "Available",
        type: "Government",
        exams: "JEE Advanced",
        recruiters: "Google, Microsoft, Amazon",
      },
      {
        name: "XYZ Institute of Technology",
        location: "Bangalore",
        course: "Information Technology",
        fees: 150000,
        rating: 4.7,
        placement: 94,
        hostel: "Available",
        type: "Private",
        exams: "JEE Main, KCET",
        recruiters: "Google, Infosys, Accenture",
      },
      {
        name: "Delhi College of Engineering",
        location: "Delhi",
        course: "Mechanical Engineering",
        fees: 100000,
        rating: 4.4,
        placement: 91,
        hostel: "Available",
        type: "Government",
        exams: "JEE Main",
        recruiters: "Microsoft, TCS, Deloitte",
      },
      {
        name: "ABC Engineering College",
        location: "Hyderabad",
        course: "Computer Science Engineering",
        fees: 120000,
        rating: 4.3,
        placement: 92,
        hostel: "Available",
        type: "Private",
        exams: "JEE Main, TS EAMCET",
        recruiters: "TCS, Infosys, Wipro",
      },
      {
        name: "Andhra Institute of Technology",
        location: "Anantapur",
        course: "Electronics and Communication Engineering",
        fees: 90000,
        rating: 4.3,
        placement: 85,
        hostel: "Available",
        type: "Private",
        exams: "AP EAMCET",
        recruiters: "Infosys, Wipro, Tech Mahindra",
      },
      {
        name: "National Engineering College",
        location: "Chennai",
        course: "Computer Science Engineering",
        fees: 110000,
        rating: 4.2,
        placement: 90,
        hostel: "Available",
        type: "Government",
        exams: "JEE Main, TNEA",
        recruiters: "TCS, Cognizant, Wipro",
      },
    ],
  });

  console.log("✅ College data inserted successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Error while seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });