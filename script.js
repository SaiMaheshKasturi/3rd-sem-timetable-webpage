
/* ===================== TOGGLE ===================== */

function toggle(cell) {
  if (cell.cellIndex === 0) return;

  let row = cell.parentElement;
  let subject = row.cells[0].innerText.trim();

  cell.classList.toggle("completed");

  updateTimetableSubject(subject);
  updateLabTimetable(subject);
  saveTableData();
}

/* ===================== SAVE ===================== */

function saveTableData() {
  let saved = {
    timestamp: new Date().toISOString(),
    classWork: [],
    labWork: []
  };

  document.querySelectorAll("#classWork tr").forEach(row => {
    let rowData = [];
    row.querySelectorAll("td").forEach(cell => {
      rowData.push(cell.classList.contains("completed"));
    });
    saved.classWork.push(rowData);
  });

  document.querySelectorAll("#labWork tr").forEach(row => {
    let rowData = [];
    row.querySelectorAll("td").forEach(cell => {
      rowData.push(cell.classList.contains("completed"));
    });
    saved.labWork.push(rowData);
  });

  localStorage.setItem("workData", JSON.stringify(saved));
}

/* ===================== LOAD ===================== */

function loadTableData() {
  let saved = JSON.parse(localStorage.getItem("workData"));
  if (!saved) return;

  let resetAssignment = isNewWeek(saved.timestamp);

  // CLASS WORK
  document.querySelectorAll("#classWork tr").forEach((row, r) => {
    row.querySelectorAll("td").forEach((cell, c) => {

      if (saved.classWork?.[r]?.[c]) {

        // assignment reset only
        if (resetAssignment && c === 2) {
          cell.classList.remove("completed");
        } else {
          cell.classList.add("completed");
        }
      }
    });

    let subject = row.cells[0].innerText.trim();
    updateTimetableSubject(subject);
  });

  // LAB WORK
  document.querySelectorAll("#labWork tr").forEach((row, r) => {
    row.querySelectorAll("td").forEach((cell, c) => {
      if (saved.labWork?.[r]?.[c]) {
        cell.classList.add("completed");
      }
    });

    let subject = row.cells[0].innerText.trim();
    updateLabTimetable(subject);
  });
}

/* ===================== TODAY CHECK ===================== */

function isSubjectInTodayTimetable(subjectName) {
  let cells = document.querySelectorAll("#timetable td");

  for (let cell of cells) {
    if (cell.innerText.trim() === subjectName) {
      return true;
    }
  }
  return false;
}

/* ===================== CLASS WORK ===================== */

function updateTimetableSubject(subjectName) {

  if (!isSubjectInTodayTimetable(subjectName)) return;

  let cells = document.querySelectorAll("#timetable td");

  cells.forEach(cell => {
    if (cell.innerText.trim() === subjectName) {

      if (subjectName === "SPORTS") {
        cell.classList.add("completed");
        return;
      }

      let row = findClassRow(subjectName);
      if (!row) return;

      let notes = row.cells[1].classList.contains("completed");
      let assign = row.cells[2].classList.contains("completed");

      if (notes && assign) {
        cell.classList.add("completed");
      } else {
        cell.classList.remove("completed");
      }
    }
  });
}

function findClassRow(subjectName) {
  let rows = document.querySelectorAll("#classWork tr");

  for (let row of rows) {
    if (row.cells[0].innerText.trim() === subjectName) {
      return row;
    }
  }
  return null;
}

/* ===================== LAB WORK ===================== */

function updateLabTimetable(subjectName) {

  if (!isSubjectInTodayTimetable(subjectName)) return;

  let labRow = findLabRow(subjectName);
  if (!labRow) return;

  let record = labRow.cells[1].classList.contains("completed");
  let obs = labRow.cells[2].classList.contains("completed");

  let cells = document.querySelectorAll("#timetable td");

  cells.forEach(cell => {
    if (cell.innerText.trim() === subjectName) {

      if (record && obs) {
        cell.classList.add("completed");
      } else {
        cell.classList.remove("completed");
      }
    }
  });
}

function findLabRow(subjectName) {
  let rows = document.querySelectorAll("#labWork tr");

  for (let row of rows) {
    if (row.cells[0].innerText.trim() === subjectName) {
      return row;
    }
  }
  return null;
}


/* ===================== WEEK RESET ===================== */

function isNewWeek(savedTime) {
  if (!savedTime) return false;

  let now = new Date();
  let last = new Date(savedTime);

  let sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());
  sunday.setHours(12, 0, 0, 0);

  return last < sunday && now >= sunday;
}

/* ===================== TODAY HIGHLIGHT ===================== */

function highlightTodayRow() {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let today = days[new Date().getDay()];

  let table = document.getElementById("timetable");

  for (let i = 1; i < table.rows.length; i++) {
    let row = table.rows[i];
    let firstCell = row.cells[0];

    if (firstCell.innerText === today) {
      row.classList.add("today-row");
    }
  }
}

/* ===================== INIT ===================== */

window.onload = function () {
  loadTableData();
  highlightTodayRow();
};