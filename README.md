# CollegeFinder – College Discovery Platform

A full-stack college discovery platform that helps students search, explore, compare, and save colleges based on important academic and placement information.

## 🚀 Live Demo

https://college-discovery-platform-9mys.vercel.app/

## 📂 GitHub Repository

https://github.com/rishithanichenametla737/college-discovery-platform

## 📌 Project Overview

CollegeFinder is a responsive web application designed to make college discovery easier for students.

Students can search and filter colleges, view detailed college information, compare colleges, save favorites, and share their experiences through reviews.

The platform also includes an admin dashboard for managing and monitoring college information.

## ✨ Features

### 🎓 College Discovery

- Search colleges by name
- Filter colleges by location
- Filter colleges by course
- View popular colleges
- Browse the complete college directory

### 🔍 College Details

Each college has a dedicated details page containing:

- College name and location
- Course information
- Annual fees
- Rating
- Placement percentage
- Hostel availability
- College type
- Admission exams
- Top recruiters
- College highlights

### ⚖️ College Comparison

- Select colleges for comparison
- Compare important details such as:
  - Rating
  - Placement
  - Fees
  - Hostel availability
  - College type
  - Location

### ❤️ Favorites

- Save colleges to favorites
- View saved colleges
- Remove colleges from favorites

### ⭐ Student Reviews

- Add reviews
- Edit reviews
- Delete reviews
- View average college rating
- Reviews are stored using the backend database

### 🔐 Student Authentication

- Student registration
- Student login
- Student logout

### 👨‍💼 Admin Dashboard

- Admin login
- View total colleges
- View average rating
- View locations covered
- View average placement
- Manage college information

### 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Prisma ORM

### Database

- PostgreSQL

### Deployment

- Vercel

## 🏗️ Project Structure

```text
college-discovery-platform/
│
├── app/
│   ├── admin/
│   ├── api/
│   ├── colleges/
│   ├── favorites/
│   ├── login/
│   ├── register/
│   ├── student-login/
│   ├── page.tsx
│   └── globals.css
│
├── lib/
├── prisma/
├── public/
├── package.json
├── prisma.config.ts
└── README.md