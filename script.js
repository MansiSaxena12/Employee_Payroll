document.addEventListener("click", async (e) => {
    if (e.target.closest(".edit-btn")) {
        const id = e.target.closest(".edit-btn").dataset.id;
        window.location.href = `practice form.html?id=${id}`;
    }
  });


fetch("db.json")
  .then(response => response.json())
  .then(data => {
    const employee = data.employee;
    employee.reverse();
    const tbody = document.querySelector("#mytablw tbody");
    console.log(employee);
    

    tbody.innerHTML = ""; // clear table first

    employee.forEach(emp => {
      console.log(emp.profile_img);
      // console.log(emp.startdate[0] ,emp.startdate[1]);
      const deptBadges = emp.department
    .map(dep => `<span class="dept-badge">${dep}</span>`)
    .join("");
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <img src="${emp.profileimg}" alt="profile" width="28px">
        </td>
        <td>${emp.name}</td>
        <td>${emp.gender}</td>
        <td>${deptBadges}</td>
        
        <td>₹ ${emp.salary.toLocaleString()}</td>
        <td>${emp.startdate.day} ${emp.startdate.month} ${emp.startdate.year}</td>
        <td><button class="btn btn-sm delete-btn px-1 py-0" data-id="${emp.id}">
          <i class="bi bi-trash3-fill" style="color:#658298"></i>
        </button>
        <button class="btn btn-sm edit-btn px-1 py-0" data-id="${emp.id}">
          <i class="bi bi-pencil-fill" style="color:#658292"></i>
        </button></td>
      `;

      tbody.appendChild(tr);
    });
  })
  .catch(error => console.error("Error loading JSON:", error));


  //delete the row
document.addEventListener("click", async (e) => {
  if (e.target.closest(".delete-btn")) {
    const id = e.target.closest(".delete-btn").dataset.id;

    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:3000/employee/${id}`, {
        method: "DELETE"
      });

      alert("Employee deleted ✅");
      location.reload(); // reload table
    } catch (error) {
      console.error("Delete error:", error);
    }
  }
});



//Search button

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// Toggle search bar on icon click
searchBtn.addEventListener("click", () => {
  const isHidden = searchInput.style.display === "none";
  searchInput.style.display = isHidden ? "block" : "none";

  if (isHidden) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    filterTable("");
  }
});

// Live search while typing
searchInput.addEventListener("input", () => {
  filterTable(searchInput.value);
});

function filterTable(value) {
  const searchValue = value.toLowerCase();
  const rows = document.querySelectorAll("#mytablw tbody tr");

  rows.forEach(row => {
    const rowText = row.innerText.toLowerCase();
    row.style.display = rowText.includes(searchValue) ? "" : "none";
  });
}