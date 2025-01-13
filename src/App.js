import React, { useEffect, useState } from 'react';
import axiosInstance from './api/axios'; // Import the Axios instance

function App() {
    const [appointments, setAppointments] = useState([]); // Appointment state
    const [error, setError] = useState(null); // Error state
    const [form, setForm] = useState({ title: "", description: "", date_time: ""}); // Form state
    const [successMessage, setSuccessMessage] = useState(""); // Success message
    const [editingId, setEditingId] = useState(null); // Track the appointment being edited

    // Fetch appointments on component load
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get(''); // Fetch from backend
                console.log('API Response:', response.data); // Debugging log
                setAppointments(response.data); // Update state with fetched data
            } catch (err) {
                setError('Error fetching appointments'); //Log the error
                console.error(err); // Display error
            }
        };

        fetchAppointments(); // Call the fetch function
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleEdit = (appointment) => {
        setForm({
            title: appointment.title,
            description: appointment.description,
            date_time: new Date(appointment.date_time).toISOString().slice(0, 16), // Format for datetime-local input
        });
        setEditingId(appointment.id); // Track the appointment being edited
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`${id}/`); // Send DELETE request
            setAppointments((prev) => prev.filter((appointment) => appointment.id !== id)); // Remove from state
        } catch (err) {
            console.error("Error deleting appointment:", err);
            setError("Error deleting appointment");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the date is in the future
        const selectedDate = new Date(form.date_time);
        const now = new Date();

        if (selectedDate <= now) {
            setError("Date and time must be in the future.");
            setSuccessMessage("");
            return;
        }

        try {
            if (editingId) {
                // Update appointment
                const response = await axiosInstance.put(`${editingId}/`, form);
                setAppointments((prev) =>
                    prev.map((appointment) =>
                        appointment.id === editingId ? response.data : appointment
                    )
                );
                setEditingId(null); // Reset editing state
            } else {
                // Create appointment
                const response = await axiosInstance.post("", form);
            setAppointments((prev) => [...prev, response.data]); // Add new appointment
            }    
            
            setForm({ title: "", description: "", date_time: "" }); // Reset form
            setSuccessMessage(editingId ? "Appointment updated successfully!" : "Appointment created successfully!");
            setError(null);
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError(editingId ? "Error updated appointment" : "Error creating appointment");
            setSuccessMessage("");
        }
    };

    return (
        <div>
            <h1>Appointments</h1>

            {/* Success or Error Message */}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
            
            {/* Appointment List */}
            {appointments.length === 0 ? (
                <p>No appointments to display.</p>
            ) : (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            <strong>Title:</strong> {appointment.title} <br />
                            <strong>Description:</strong> {appointment.description} <br />
                            <strong>Date:</strong> {new Date(appointment.date_time).toLocaleString()} <br />
                            <button onClick={() => handleEdit(appointment)}>Edit</button>
                            <button onClick={() => handleDelete(appointment.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Form to Create Appointment */}
            <h2>Create Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />    
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />    
                </div>
                <div>
                    <label>Date/Time:</label>
                    <input
                        type="datetime-local"
                        name="date_time"
                        value={form.date_time}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().slice(0, 16)} // Ensures users can only pick a future date/time
                        placeholder="Select a future date and time" 
                    />    
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default App;
