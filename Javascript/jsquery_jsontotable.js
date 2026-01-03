$(document).ready(function () {

  // ---------------- EDIT BUTTON ----------------
  $(document).on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    window.location.href = `practice form.html?id=${id}`;
  });


  // ---------------- LOAD TABLE DATA ----------------
  $.getJSON("jsq.json", function (data) {

    const employee = data.employee.reverse();
    const $tbody = $("#mytablw tbody");

    $tbody.empty();

    employee.forEach(emp => {
      const row = `
        <tr>
          <td>
            <img src="${emp.profileimg}" width="28">
          </td>
          <td>${emp.name}</td>
          <td>${emp.gender}</td>
          <td>${emp.department.join(" ")}</td>
          <td>${Number(emp.salary).toLocaleString()}</td>
          <td>${emp.startdate.day} ${emp.startdate.month} ${emp.startdate.year}</td>
          <td>
            <button class="delete-btn" data-id="${emp.id}">🗑️</button>
            <button class="edit-btn" data-id="${emp.id}">✏️</button>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });
  });


  // ---------------- DELETE BUTTON ----------------
  $(document).on("click", ".delete-btn", async function () {

    const id = $(this).data("id");

    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      await $.ajax({
        url: `http://localhost:3000/employee/${id}`,
        method: "DELETE"
      });

      alert("Employee deleted ✅");
      location.reload();

    } catch (error) {
      console.error("Delete error:", error);
    }
  });


  // ---------------- SEARCH BUTTON ----------------
  $("#searchBtn").on("click", function () {

    const $searchInput = $("#searchInput");
    const isHidden = $searchInput.is(":hidden");

    $searchInput.toggle(isHidden);

    if (isHidden) {
      $searchInput.focus();
    } else {
      $searchInput.val("");
      filterTable("");
    }
  });


  // ---------------- LIVE SEARCH ----------------
  $("#searchInput").on("input", function () {
    filterTable($(this).val());
  });


  // ---------------- FILTER FUNCTION ----------------
  function filterTable(value) {

    const searchValue = value.toLowerCase();

    $("#mytablw tbody tr").each(function () {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchValue));
    });
  }

});
