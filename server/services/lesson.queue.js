const { Queue, Worker, QueueEvents } = require("bullmq");
const Module = require("../models/Module.model");
const Lesson = require("../models/Lesson.model");
const generateLesson = require("../utils/ai.lesson.helper");
const getVideos = require("../utils/youtube.helper");

const QUEUE_NAME = "lesson-generation";

function getConnection() {
  if (process.env.REDIS_URL) {
    return { url: process.env.REDIS_URL };
  }

  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  };
}

const connection = getConnection();

const lessonQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    removeOnComplete: {
      age: 60 * 60,
      count: 500,
    },
    removeOnFail: {
      age: 24 * 60 * 60,
      count: 500,
    },
    attempts: 1,
  },
});

const lessonQueueEvents = new QueueEvents(QUEUE_NAME, { connection });

lessonQueueEvents.on("error", (error) => {
  console.error("Lesson queue event error:", error.message);
});

const lessonWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const moduleId = job.data?.moduleId;
    if (!moduleId) {
      throw new Error("moduleId is required");
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      throw new Error("Module not found");
    }

    if (module.lessons != null) {
      return {
        moduleId,
        lesson: module.lessons,
        message: "Module already has lessons",
      };
    }

    const lesson = await generateLesson(module.title);
    const videos = await getVideos(module.title);

    const newLesson = new Lesson({
      title: lesson.title,
      content: lesson.content,
      videos,
    });

    await newLesson.save();
    module.lessons = newLesson;
    await module.save();

    return {
      moduleId,
      lesson: module.lessons,
      message: "Lesson created successfully",
    };
  },
  {
    connection,
    concurrency: 2,
  }
);

lessonWorker.on("failed", (job, error) => {
  console.error(`Lesson job ${job?.id} failed:`, error.message);
});

lessonWorker.on("error", (error) => {
  console.error("Lesson worker error:", error.message);
});

async function enqueueLessonJob(moduleId) {
  return lessonQueue.add("generate-lesson", { moduleId });
}

async function getLessonJobStatus(jobId) {
  const job = await lessonQueue.getJob(jobId);
  if (!job) {
    return null;
  }

  const state = await job.getState();

  return {
    job,
    state,
    status: state,
    progress: typeof job.progress === "number" ? job.progress : 0,
    result: state === "completed" ? job.returnvalue : undefined,
    failedReason: state === "failed" ? job.failedReason : undefined,
  };
}

module.exports = {
  enqueueLessonJob,
  getLessonJobStatus,
};
