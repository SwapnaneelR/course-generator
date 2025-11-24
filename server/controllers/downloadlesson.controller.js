const Module = require("../models/Module.model");
const PDFDocument = require("pdfkit");
async function downloadLessonController(req, res) {
  const mod_id = req.params.id;
  if (!mod_id) {
    return res.status(400).json({
      message: "Module ID is required",
    });
  }
  const module = await Module.findById(mod_id);
  console.log(mod_id + "  " + module);
  if (module.lessons == null) {
    res.status(404).json({
      message: "No lessons found for this module",
    });
    return;
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${module.lessons.title}.pdf`
  );
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(20).text(module.lessons.title, { underline: true });
  doc.moveDown();
  doc.fontSize(16).text("Notes", { bold: true });
  doc.moveDown();
  doc.fontSize(12).text(module.lessons.content.notes, { align: "justify" });
  doc.moveDown();
  doc.fontSize(16).text("References", { bold: true });
  doc.moveDown();
  module.lessons.content.links.forEach((link, index) => {
    doc
      .fontSize(12)
      .fillColor("blue")
      .text(`${index + 1}. ${link}`, {
        link: link,
        underline: true,
      });
    doc.moveDown();
  });
  doc.end();
}
module.exports = downloadLessonController;
