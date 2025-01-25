const form = document.getElementById("add-appointment");
const tableBody = document.querySelector("#appointments-table tbody");
const searchInput = document.getElementById("search");

const apiBaseUrl = "http://localhost:3000/api/appointments"; // Backend URL

// Function to fetch and render appointments from the server
async function fetchAppointments(query = "") {
  try {
    const response = await fetch(`${apiBaseUrl}?search=${query}`);
    const appointments = await response.json();
    renderAppointments(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
}

// Function to render appointments in the table
function renderAppointments(appointments) {
  tableBody.innerHTML = "";
  appointments.forEach((appointment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${appointment.patientName}</td>
      <td>${appointment.age || "-"}</td>
      <td>${appointment.sex || "-"}</td>
      <td>${appointment.coverage || "-"}</td>
      <td>${appointment.referringDoctor || "-"}</td>
      <td>${appointment.caseDescription || "-"}</td>
      <td>${new Date(appointment.date).toLocaleString()}</td>
      <td>${appointment.additionalNotes || "-"}</td>
      <td>
        <button onclick="cancelAppointment('${appointment.id}')">Cancel</button>
        <button onclick="deleteAppointment('${appointment.id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to create a new appointment
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newAppointment = {
    patientName: document.getElementById("patient-name").value,
    age: document.getElementById("patient-age").value,
    sex: document.getElementById("patient-sex").value,
    coverage: document.getElementById("coverage").value,
    referringDoctor: document.getElementById("referring-dr").value,
    caseDescription: document.getElementById("case-description").value,
    date: document.getElementById("appointment-date").value,
    additionalNotes: document.getElementById("additional-notes").value,
  };

  try {
    const response = await fetch(apiBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAppointment),
    });

    if (response.ok) {
      alert("Appointment added successfully!");
      form.reset();
      fetchAppointments(); // Refresh the list
    } else {
      alert("Error adding appointment");
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
  }
});

// Function to cancel an appointment
async function cancelAppointment(id) {
  try {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cancelled: true }),
    });

    if (response.ok) {
      alert("Appointment canceled successfully!");
      fetchAppointments(); // Refresh the list
    } else {
      alert("Error canceling appointment");
    }
  } catch (error) {
    console.error("Error canceling appointment:", error);
  }
}

// Function to delete an appointment
async function deleteAppointment(id) {
  try {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Appointment deleted successfully!");
      fetchAppointments(); // Refresh the list
    } else {
      alert("Error deleting appointment");
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
  }
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  fetchAppointments(query); // Fetch filtered results
});

// Initial fetch and render
fetchAppointments();
