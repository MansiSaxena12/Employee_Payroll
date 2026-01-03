$(document).ready(function () {

  /* ---------------- GET ID FROM URL ---------------- */
  const params = new URLSearchParams(window.location.search);
  const empId = params.get("id");

  /* ---------------- EDIT MODE ---------------- */
  if (empId) {
    $.ajax({
      url: `http://localhost:3000/employee/${empId}`,
      method: "GET",
      success: function (datum1) {

        $('input[name="name"]').val(datum1.name);
        $('select[name="salary"]').val(datum1.salary);

        $(`input[name="gender"][value="${datum1.gender}"]`).prop("checked", true);
        $(`input[name="profileimg"][value="${datum1.profileimg}"]`).prop("checked", true);

        datum1.department.forEach(dep => {
          $(`input[name="dept[]"][value="${dep}"]`).prop("checked", true);
        });

        $('select[name="day"]').val(datum1.startdate.day);
        $('select[name="month"]').val(datum1.startdate.month);
        $('select[name="year"]').val(datum1.startdate.year);
      },
      error: function (err) {
        console.error("Error:", err);
      }
    });
  }

  /* ---------------- FORM SUBMIT ---------------- */
  $("form").on("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    // Clear errors
    $("#nameError, #genderError, #deptError, #salaryError, #dateError, #profileimgerror").text("");

    const name = $('input[name="name"]').val().trim();
    const profileimg = $('input[name="profileimg"]:checked').val();
    const gender = $('input[name="gender"]:checked').val();

    const department = $('input[name="dept[]"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();

    const salary = $('select[name="salary"]').val();

    const startdate = {
      day: $('select[name="day"]').val(),
      month: $('select[name="month"]').val(),
      year: $('select[name="year"]').val()
    };

    /* ---------------- VALIDATION ---------------- */
    if (!name) {
      $("#nameError").text("name is required*");
      isValid = false;
    }
    if (!gender) {
      $("#genderError").text("gender is required*");
      isValid = false;
    }
    if (!profileimg) {
      $("#profileimgerror").text("image is required*");
      isValid = false;
    }
    if (department.length === 0) {
      $("#deptError").text("select at least one department*");
      isValid = false;
    }
    if (!salary) {
      $("#salaryError").text("select salary*");
      isValid = false;
    }
    if (!startdate.day || !startdate.month || !startdate.year) {
      $("#dateError").text("select date*");
      isValid = false;
    }

    if (!isValid) return;

    /* ---------------- DUPLICATE NAME CHECK ---------------- */
    $.ajax({
      url: "http://localhost:3000/employee",
      method: "GET",
      success: function (employees) {

        const nameExists = employees.some(emp =>
          emp.name.toLowerCase() === name.toLowerCase()
        );

        if (nameExists && !empId) {
          $("#nameError").text("This name already exists");
          return;
        }

        /* ---------------- SAVE DATA ---------------- */
        const employeeData = {
          name,
          profileimg,
          gender,
          department,
          salary,
          startdate
        };

        const url = empId
          ? `http://localhost:3000/employee/${empId}`
          : "http://localhost:3000/employee";

        const method = empId ? "PUT" : "POST";

        $.ajax({
          url,
          method,
          contentType: "application/json",
          data: JSON.stringify(employeeData),
          success: function () {
            $("form")[0].reset();
            window.location.href = "practicetable.html";
            alert(empId ? "Employee Updated ✅" : "Employee Added ✅");
          },
          error: function (err) {
            console.error("Save error:", err);
          }
        });
      }
    });
  });

  /* ---------------- CANCEL BUTTON ---------------- */
  $("#cancelBtn").on("click", function () {
    const confirmCancel = confirm(
      "Are you sure you want to cancel?\nAll unsaved changes will be lost."
    );

    if (confirmCancel) {
      window.location.href = "practicetable.html";
    }
  });

});
