// GET ID FROM URL
const params = new URLSearchParams(window.location.search);
const empId = params.get("id");

// EDIT MODE
if (empId) {
  fetch(`http://localhost:3000/employee/${empId}`)
    .then(res => res.json())
    .then(datum1 => {
        // const employee = datum1.employee;
      document.querySelector('input[name="name"]').value = datum1.name;
      document.querySelector('select[name="salary"]').value = datum1.salary;

      document.querySelector(`input[name="gender"][value="${datum1.gender}"]`).checked = true;
      document.querySelector(`input[name="profileimg"][value="${datum1.profileimg}"]`).checked = true;

      datum1.department.forEach(dep => {
        document.querySelector(`input[name="dept[]"][value="${dep}"]`).checked = true;
        
      });

      document.querySelector('select[name="day"]').value = datum1.startdate.day;
      document.querySelector('select[name="month"]').value = datum1.startdate.month;
      document.querySelector('select[name="year"]').value = datum1.startdate.year;
    })
    .catch(err => console.error("Error:", err));
}

// ---------------- FORM SUBMIT ----------------
const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector('input[name="name"]').value;
  const profileimg = document.querySelector('input[name="profileimg"]:checked')?.value;
  const gender = document.querySelector('input[name="gender"]:checked')?.value;

  const department = Array.from(
    document.querySelectorAll('input[name="dept[]"]:checked')
  ).map(dep => dep.value);

  const salary = document.querySelector('select[name="salary"]').value;

  const startdate = {
    day: document.querySelector('select[name="day"]').value,
    month: document.querySelector('select[name="month"]').value,
    year: document.querySelector('select[name="year"]').value
  };

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

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employeeData)
  });

//   alert(empId ? "Employee Updated ✅" : "Employee Added ✅");
  form.reset();
  window.location.href=`practicetable.html`;
  alert(empId ? "Employee Updated ✅" : "Employee Added ✅");
});


