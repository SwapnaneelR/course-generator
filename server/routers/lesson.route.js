const router = require("express").Router(); 
const downloadLessonController = require("../controllers/downloadlesson.controller");
const createLessonController = require("../controllers/createlesson.controller");
const lessonStatusController = require("../controllers/lessonstatus.controller");

router.post("/create", createLessonController);
router.get("/status/:jobId", lessonStatusController);
router.get("/download/:id",downloadLessonController);

module.exports =  router;