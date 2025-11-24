const router = require("express").Router(); 
const downloadLessonController = require("../controllers/downloadlesson.controller");
const createLessonController = require("../controllers/createlesson.controller");
router.post("/create", createLessonController);
router.get("/download/:id",downloadLessonController);
module.exports =  router;