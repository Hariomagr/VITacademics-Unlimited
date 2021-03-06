/**
 * @module routes/grades
 */
const path = require("path");
const requests = require(path.join(__dirname, "..", "utilities", "requests"));
const academic = require(path.join(__dirname, "..", "scrapers", "academic"));
const express = require("express");
const router = express.Router();

/**
 * POST /grades
 *
 * respond with academic history
 */

router.post("/", (req, res, next) => {
  const campus = req.body.campus;
  if (campus == "chennai") {
    const baseUri = "https://academicscc.vit.ac.in/student";
    const uri = `${baseUri}/student_history.asp`;
    const task = requests.get(uri, req.cookies);
    task
      .then(academic.parseHistory)
      .then(result => res.json(result))
      .catch(next);
  } else {
    if(req.body.reg_no.startsWith("18")){
      res.json({
        grades: [],
        semester_wise: {},
        grade_count: []});

    }else {
      const historyUri =
        "https://vtop.vit.ac.in/vtop/examinations/examGradeView/StudentGradeHistory";
      requests
        .post(historyUri, req.cookies)
        .then(academic.parseHistoryBeta)
        .then(results => {
          res.json(results);
        })
        .catch(next);
    }
  }
});

module.exports = router;
