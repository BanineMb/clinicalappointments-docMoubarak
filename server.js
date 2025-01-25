const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000; // You can use any port you like

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for appointments
let appointments = [];

// Route to add an appointment
app.post("/api/appointments", (req, res) => {
  const {
    patientName,
    age,
    sex,
    coverage,
    referringDoctor,
    caseDescription,
    date,
    additionalNotes,
  } = req.body;

  // Validate the request body
  if (!patientName || !age || !sex || !coverage || !referringDoctor || !date) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Add to the in-memory storage
  const newAppointment = {
    id: Date.now(),
    patientName,
    age,
    sex,
    coverage,
    referringDoctor,
    caseDescription,
    date,
    additionalNotes,
  };

  appointments.push(newAppointment);

  res
    .status(201)
    .json({ message: "Appointment created!", appointment: newAppointment });
});

// Route to get all appointments with search
app.get("/api/appointments", (req, res) => {
  const { search } = req.query;
  let filteredAppointments = appointments;

  if (search) {
    filteredAppointments = appointments.filter((appointment) =>
      appointment.patientName.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.status(200).json(filteredAppointments);
});

// Route to delete an appointment
app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  appointments = appointments.filter(
    (appointment) => appointment.id !== parseInt(id)
  );

  res.status(204).send(); // Send a 204 No Content response
});

// Route to cancel an appointment
app.patch("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const appointment = appointments.find(
    (appointment) => appointment.id === parseInt(id)
  );

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found!" });
  }

  // Update the appointment as cancelled
  appointment.cancelled = true;

  res.status(200).json({ message: "Appointment cancelled!", appointment });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
