import React, { useEffect, useState } from 'react';
import axiosInstance from './api/axios'; // Import the Axios instance

function App() {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <div>
            <h1>Appointments</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
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
        </div>
    );
}

export default App;
