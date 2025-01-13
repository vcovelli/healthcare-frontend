import React, { useEffect, useState } from 'react';
import axiosInstance from './api/axios'; // Import the Axios instance

function App() {
    const [appointments, setAppointments] = useState([]); // Appointment state
    const [error, setError] = useState(null); // Error state
    const [form, setForm] = useState({ title: "", description: "", date_time: ""}); // Form state
    const [successMessage, setSuccessMessage] = useState(""); // Success message

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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("", form);
            setAppointments((prev) => [...prev, response.data]); // Add new appointment
            setForm({ title: "", description: "", date_time: "" }); // Reset form
            setSuccessMessage("Appointment created successfully!");
            setError(null);
        } catch (err) {
            setError("Error creating appointment");
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
                            <strong>Date:</strong> {appointment.date_time}
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
                    />    
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default App;
