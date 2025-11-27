# Course Generator
> This is a full-stack web application for generating and managing online courses, built with Next.js for the client-side and Express.js for the server-side. It features user authentication, course creation, module and lesson management, and AI-assisted content generation.

**Features implemented:**
- authentication
- course creation
- module and lesson management
- AI-assisted content generation
- quiz and reference websites
- downloadable as pdf


**Authentication**
- NextAuth integration (client API route at `app/api/auth/[...nextauth]/route.js`) with Google and GitHub providers.
- Session refresh configuration present (project contains a short refresh interval setting).
 

**Next.js client**
- App directory with pages for home, course listing, course details (`/course/[slug]`), and module pages (`/module/[slug]`).
- UI components under `components/ui/` (buttons, cards, `Courses.jsx`, `Home.jsx`, `Sidebar.jsx`, `MCQBlock.jsx`, `NotesBlock.jsx`, etc.).
- Global styles and theme provider (`app/globals.css`, `components/ui/theme-provider.jsx`).
- Client API route for authentication and Jest-based tests (`jest.config.js`, `__test__/auth-config.test.js`).

**Server (API)**
- Express server entry `server/index.js` with routing and controllers.
- Controllers for creating and retrieving content: `createcourse.controller.js`, `createmodule.controller.js`, `createlesson.controller.js`, `getcourse.controller.js`, `downloadlesson.controller.js`.
- Routers for auth, course, lesson, and module under `server/routers/`.
- Mongoose models: `Course.model.js`, `Module.model.js`, `Lesson.model.js`, `User.model.js`.
- Database configuration at `config/db.config.js` and DB connection tests (`server/__test__/db_connection.test.js`).

**Utilities and services**
- AI helpers: `utils/ai.helper.js` and `utils/ai.lesson.helper.js`.
- YouTube helper: `utils/youtube.helper.js`.
- Server-side services located in `server/services/`.
 
 
