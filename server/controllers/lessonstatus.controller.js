const Module = require("../models/Module.model");
const { getLessonJobStatus } = require("../services/lesson.queue");

async function lessonStatusController(req, res) {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    const jobStatus = await getLessonJobStatus(jobId);
    if (!jobStatus) {
      return res.status(404).json({
        status: "not_found",
        message: "Job not found",
      });
    }

    if (jobStatus.status === "completed") {
      const moduleId = jobStatus.result?.moduleId;
      const module = moduleId ? await Module.findById(moduleId) : null;

      return res.status(200).json({
        status: "completed",
        message: jobStatus.result?.message || "Lesson created successfully",
        module,
        lesson: module?.lessons || jobStatus.result?.lesson,
      });
    }

    if (jobStatus.status === "failed") {
      return res.status(200).json({
        status: "failed",
        message: jobStatus.failedReason || "Lesson generation failed",
      });
    }

    return res.status(200).json({
      status: jobStatus.status,
      progress: jobStatus.progress,
      message: "Lesson generation in progress",
    });
  } catch (error) {
    console.error("Error checking lesson status:", error.message);
    return res.status(500).json({
      message: "Failed to fetch lesson status",
      error: error.message,
    });
  }
}

module.exports = lessonStatusController;
