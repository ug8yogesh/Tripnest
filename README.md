# ✈️ TripNest

**Travel Planning & Trip Management Platform**

TripNest is a full-stack travel planning and trip management platform built with **React** and **Spring Boot**. It helps travelers plan trips, build day-wise itineraries, manage budgets and expenses, collaborate with friends and family, discover destinations, and organize travel information — all from one centralized dashboard.

🌐 **Live demo:** https://tripnest-frontend-j0h4.onrender.com
🔌 **Backend API:** https://tripnest-backend-quas.onrender.com
📦 **Repository:** https://github.com/ug8yogesh/Tripnest

> **Note:** The production authentication flow is currently being finalized — some auth-dependent features on the live demo may be limited.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### 🔐 Authentication & Authorization
- Email/password registration and login
- JWT-based authentication (stateless API access)
- Google OAuth2 login
- Password reset via email
- Role-based access control — **Traveler**, **Group Admin**, **Administrator**

### 👤 User Profile Management
- Profile creation and customization
- Travel preferences and favorite destinations
- Travel history and account settings

### 🧳 Trip Management
- Create, edit, delete, and browse trips
- Trip sharing and trip timeline
- Status tracking: `planning → upcoming → ongoing → completed`
- Trip details: destination, start/end date, travelers, budget, status

### 🗓️ Itinerary Planning
- Day-wise itinerary creation with drag-and-drop planning
- Activity scheduling with timing, location, and estimated cost
- Activity types: sightseeing, transportation, accommodation, dining, adventure, shopping
- Travel timeline and activity reminders

### 💰 Budget & Expense Management
- Trip budget planning and cost estimation
- Category-wise expense tracking (transportation, hotel, food, shopping, entertainment, misc.)
- Live spend-vs-budget summary with automatic threshold alerts
- Expense reports and receipt upload

### 👥 Group Collaboration
- Create a travel group per trip and invite members by email
- Shared itineraries and group discussions/chat
- Shared expenses with settlement calculations (who owes whom)
- Group role management

### 📍 Destination Discovery
- Browse and search destinations with attraction listings and travel guides
- Weather information and popular locations
- Admin-curated content

### 📄 Media & Document Management
- Upload travel documents, tickets, and hotel bookings
- Upload travel photos with cloud storage integration

### 🔔 Notifications
- Trip and activity reminders
- Budget alerts and group invitations
- Travel updates and system notifications

### 📊 Reports & Analytics
**Traveler Dashboard** — upcoming trips, budget overview, expense summary, travel statistics, favorite destinations
**Admin Dashboard** — user analytics, trip analytics, destination analytics, revenue reports, platform statistics

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React (Vite), React Router, Axios, Tailwind CSS, Context API, Chart.js |
| **Backend** | Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate, Maven |
| **Database** | PostgreSQL (production) · MySQL (local development) |
| **Authentication** | JWT · OAuth2 (Google) |
| **External APIs** | Google Maps API, OpenWeather API, Stripe / Razorpay (optional) |
| **Notifications** | Firebase Cloud Messaging, JavaMailSender |
| **Testing** | JUnit, Mockito, React Testing Library, Postman |
| **Dev & Deployment** | Docker, Docker Compose, GitHub Actions, Render / AWS / Railway |

---

## Architecture

```
                    ┌─────────────────────┐
                    │       React          │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │ REST APIs
                               ▼
                    ┌─────────────────────┐
                    │     Spring Boot      │
                    │   Backend (API +     │
                    │  Security Layer)     │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │ PostgreSQL  │   │   Spring    │   │  External   │
      │  Database   │   │  Security   │   │    APIs     │
      └─────────────┘   └─────────────┘   └─────────────┘
```

The backend exposes domain services for users, trips, itineraries, budgets, expenses, collaboration/groups, notifications, destinations, and media — all behind a JWT-authenticated API gateway with role-based access control.

---

## Project Structure

```
Tripnest/
├── tripnest-backend/            # Spring Boot REST API
│   └── src/main/java/com/tripnest/backend/
│       ├── controllers/         # REST endpoints
│       ├── service/             # Business logic
│       ├── entity/              # JPA entities
│       ├── repository/          # Spring Data repositories
│       ├── dto/                 # Request/response DTOs
│       ├── security/            # JWT + OAuth2 config
│       ├── config/              # Security, CORS config
│       └── exception/           # Global exception handling
│
├── tripnest-frontend/           # React (Vite) SPA
│   └── src/
│       ├── api/                 # Axios API modules
│       ├── context/             # Auth context
│       ├── pages/                # Route-level pages
│       ├── components/          # Shared UI components
│       └── routes/               # Protected route wrapper
│
├── docker-compose.yml
├── .github/workflows/           # CI pipeline
└── README.md
```

---

## Getting Started

### Prerequisites

- Java 17+ and Maven
- Node.js 18+ and npm
- PostgreSQL or MySQL (or use Docker Compose)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ug8yogesh/Tripnest.git
cd Tripnest
```

### 2. Backend setup

Create a `.env` file (or environment variables) inside `tripnest-backend/`:

```env
DB_URL=jdbc:postgresql://localhost:5432/tripnest
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

MAIL_USERNAME=your_smtp_username
MAIL_PASSWORD=your_smtp_app_password

APP_FRONTEND_URL=http://localhost:5173
```

> ⚠️ Never commit secrets, passwords, or API keys to the repository.

Then run:

```bash
cd tripnest-backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

### 3. Frontend setup

```bash
cd tripnest-frontend
npm install
```

Create a `.env` file inside `tripnest-frontend/`:

```env
VITE_API_URL=http://localhost:8080
```

Then run:

```bash
npm run dev
```

The app starts on **http://localhost:5173**.

### 4. Or run everything with Docker Compose

```bash
docker-compose up --build
```

---

## API Overview

| Resource | Base path | Notes |
|---|---|---|
| Auth | `/api/auth` | register, login, forgot/reset password |
| Profile | `/api/profile` | view/update profile & favorites |
| Trips | `/api/trips` | CRUD, owner-scoped |
| Itinerary | `/api/trips/{tripId}/itinerary` | day-wise planning |
| Activities | `/api/itineraries/{itineraryId}/activities` | per-day activities |
| Budget | `/api/trips/{tripId}/budget` | set/view trip budget |
| Expenses | `/api/trips/{tripId}/expenses` | add/list/update/delete, category summary |
| Destinations | `/api/destinations` | public browse, admin CRUD |
| Groups | `/api/groups` | create, invite, chat, settlement |
| Notifications | `/api/notifications` | list, mark as read |

All endpoints except `/api/auth/**`, `GET /api/destinations`, and OAuth2 routes require a `Bearer` JWT.

---

## Testing

- **Backend:** JUnit + Mockito for unit and integration tests; Postman for API validation
- **Frontend:** React Testing Library for component tests

```bash
# Backend
cd tripnest-backend && mvn test

# Frontend
cd tripnest-frontend && npm test
```

---

## Deployment

TripNest is deployed as a separate frontend and backend:

```
Frontend:  React (Vite)  →  Render Static Site
Backend:   Spring Boot   →  Render  →  PostgreSQL
```

**Production URLs**
- Frontend: https://tripnest-frontend-j0h4.onrender.com
- Backend: https://tripnest-backend-quas.onrender.com

CI is handled via GitHub Actions, and the stack is fully containerized with Docker / Docker Compose for local or alternative cloud deployment (AWS, Railway, etc.).

---

## Roadmap

- [ ] Analytics dashboards (traveler & admin) with charts and reports
- [ ] Maps & weather integration (Google Maps, OpenWeather)
- [ ] Media & document upload (tickets, hotel bookings, photos) with cloud storage
- [ ] Payment / expense-splitting via Stripe or Razorpay
- [ ] Expanded automated test coverage
- [ ] Improved group expense settlement and notification workflows

---

## Developer

**Yogesh** — [GitHub](https://github.com/ug8yogesh)

## License

This project is for educational purposes.
---

<div align="center">
  🌟 If you found this project useful, consider giving it a star on GitHub!
</div>