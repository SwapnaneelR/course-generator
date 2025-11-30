# Course Generator

>Course Generator is a full-stack web application for generating and managing online courses. The client is built with Next.js and the server exposes a REST API using Express.js. The platform supports user authentication, course creation, module and lesson generation, and AI-assisted learning content.

---

## Features

This section summarises the main capabilities available in the application.

* User authentication with Google and GitHub via NextAuth on the client.
* Course creation and listing for authenticated users.
* Automatic module generation for each course using AI.
* AI-generated lessons including detailed notes, reference links, and MCQs.
* Quiz support and reference websites per lesson.
* Downloadable lesson content as PDF.
* Embedded YouTube videos for each lesson.

---

## Architecture Overview

The project is organized as a monorepo with separate client and server applications and a shared root configuration.

* **Client:** Next.js (App Router) application in `client/`, responsible for UI, authentication, and calling backend APIs.
* **Server:** Express.js API in `server/`, responsible for authentication, course/module/lesson operations, and integration with AI and YouTube.
* **Database:** MongoDB accessed via Mongoose models for User, Course, Module, and Lesson.

---

## Client Application

The client is a Next.js application bootstrapped with `create-next-app`.

### Routing and Pages

* `app/page.js`: Home page for prompting course generation.
* `app/course/page.js`: Lists user courses.
* `app/course/[slug]/page.js`: Displays a specific course and its modules.
* `app/module/[slug]/page.js`: Displays a specific module and generated lesson.

### Authentication

* NextAuth route: `app/api/auth/[...nextauth]/route.js` with Google and GitHub providers.
* `client/app/provider.js` wraps the app in `SessionProvider` for session handling.

### Layout and UI Components

* Global layout with sidebar in `app/layout.js`.
* Reusable UI components under `components/ui/`, such as:
  `button.jsx`, `card.jsx`, `Sidebar.jsx`, `Home.jsx`, `MCQBlock.jsx`, `NotesBlock.jsx`, `YoutubeBlock.jsx`, `Loading.jsx`, `HomeButton.jsx`.

### Styling and Config

* Global styles: `app/globals.css`.
* Tailwind and shadcn config: `components.json`, `postcss.config.mjs`, `lib/utils.js`.

---

## Server Application

The server is an Express.js application that exposes REST endpoints for authentication, course management, module generation, and lesson generation.

### Entry Point

**`server/index.js`**

* Configures Express, CORS, JSON parsing, and routes.
* Connects to MongoDB via `config/db.config.js`.
* Exposes `/api/health` and route groups for `/api/auth`, `/api/course`, `/api/modules`, and `/api/lesson`.

### Configuration

**`server/config/db.config.js`**

* Connects to MongoDB using `mongoose.connect` with `MONGODB_URI`.

### Models

Mongoose models define the main domain entities:

* `User.model.js`: Users with name, email, image, and associated Course documents.
* `Course.model.js`: Courses with title, description, and embedded Module documents.
* `Module.model.js`: Modules with title, description, and an embedded Lesson reference.
* `Lesson.model.js`: Lessons with title, structured content, and optional video URLs.

---

## Routes and Controllers

### Authentication

* Route: `server/routers/authroute.js`

  * **POST** `/api/auth/login` → `loginController`
* Controller: `login.controller.js`

  * Creates new users or returns an existing user response.

### Courses

* Route: `server/routers/course.route.js`

  * **POST** `/api/course/create`
  * **POST** `/api/course/get`
* Controllers:

  * `createcourse.controller.js`: Validates and creates a course; associates with user.
  * `getcourse.controller.js`: Retrieves courses by user email.

### Modules

* Route: `server/routers/module.route.js`

  * **POST** `/api/modules/create`
* Controller:

  * `createmodule.controller.js`: Generates modules using AI and stores them.

### Lessons

* Route: `server/routers/lesson.route.js`

  * **POST** `/api/lesson/create`
  * **GET** `/api/lesson/download/:id`
* Controller:

  * `createlesson.controller.js`: Generates lessons with AI, fetches YouTube videos, stores result.
  * `downloadlesson.controller.js`: Provides PDF downloads.

---

## AI and External Integrations

### AI Module Generation

`server/utils/ai.helper.js`
Uses `@google/genai` to generate modules with strict JSON validation.

### AI Lesson Generation

`server/utils/ai.lesson.helper.js`
Generates structured lessons including notes, links, and MCQs.

### YouTube Integration

`server/utils/youtube.helper.js`
Fetches related YouTube video URLs for each lesson.

---

## Testing

### Client Tests

* Jest config: `client/jest.config.js`, `client/jest.setup.js`.
* Example test: `__test__/auth-config.test.js`.

### Server Tests

* Jest + Supertest setup in `server/package.json`.
* Example test: `server/__test__/db_connection.test.js`.

---

## Getting Started

### Prerequisites

* Node.js
* npm/yarn/pnpm/bun
* MongoDB (local or remote)
* OAuth credentials (Google, GitHub)
* Google Gemini API key
* YouTube API key

### Install Client

```bash
cd client
npm install
```

### Install Server

```bash
cd server
npm install
```

### Environment Variables

Create `.env` files for both client and server.

Set:

* MongoDB URI
* NextAuth provider keys
* Gemini API key
* YouTube API key
* Allowed origins

---

## Running the Client

```bash
npm run dev
# or yarn dev
# or pnpm dev
# or bun dev
```

Available at:
**[http://localhost:3000](http://localhost:3000)**

---

## Running the Server

```bash
npm run dev
```

API available at:
**[http://localhost:5000](http://localhost:5000)**

Health check: `/api/health`

---

## Usage Flow

1. Sign in via Google or GitHub → `/api/auth/login`.
2. Create a course → `/api/course/create`.
3. View your courses → `/api/course/get`.
4. Open a course → triggers module generation → `/api/modules/create`.
5. Open a module → triggers lesson generation → `/api/lesson/create`.
6. Read notes, MCQs, reference links, videos.
7. Download lesson PDF → `/api/lesson/download/:id`. 
