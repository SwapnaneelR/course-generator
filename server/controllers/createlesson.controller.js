const Module = require("../models/Module.model");
const { enqueueLessonJob } = require("../services/lesson.queue");

async function createLessonController(req, res) {
    try {
        const mod_id = req.body.id;
        if (!mod_id) {
            return res.status(400).json({
                message: "Module ID is required",
            });
        }

        const module = await Module.findById(mod_id);
        if (!module) {
            return res.status(404).json({
                message: "Module not found",
            });
        }

        if (module.lessons != null) {
            return res.status(200).json({
                status: "completed",
                message: "Module already has lessons",
                module,
                lesson: module.lessons,
            });
        }

        const job = await enqueueLessonJob(mod_id);

        return res.status(202).json({
            status: "queued",
            message: "Lesson generation queued",
            jobId: job.id,
            moduleId: mod_id,
        });
    } catch (error) {
        console.error("Error queueing lesson generation:", error.message);
        return res.status(500).json({
            message: "Failed to queue lesson generation",
            error: error.message,
        });
    }
}

module.exports = createLessonController;