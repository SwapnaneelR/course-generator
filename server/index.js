require("dotenv").config();
const express = require("express");
const { run } = require("./config/db.config.js"); 
const cors = require("cors");
const authRoute = require("./routers/authroute");
const courseRoute = require("./routers/course.route");
const moduleRoute = require("./routers/module.route");
const lessonRoute = require("./routers/lesson.route");
const { configDotenv } = require("dotenv");
const app = express();
app.use(express.json());
const port =  process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.get("/api/health", (req, res) => {
  res.status(200).send("ok");
});
app.use("/api/auth", authRoute);
app.use("/api/course",courseRoute);
app.use("/api/modules", moduleRoute)
app.use("/api/lesson", lessonRoute);
app.get("/", async (req, res) => {
  res.send(
    "Welcome to Backend PORT. You can find the APIs and their functionalities below :"
  );
});
  
run()
  .then(async () => {
    console.log("-> Database connected successfully");
    app.listen(port, () => {
      console.log(` -> Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
