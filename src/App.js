import React, { useEffect, useState } from 'react';
import axiosInstance from './api/axios'; // Import the Axios instance

function App() {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get('');
                console.log('API Response:', response.data); // Debugging log
                setAppointments(response.data); // Assuming response.data contains appointments
            } catch (err) {
                setError('Error fetching appointments');
                console.error(err);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div>
            <h1>Appointments</h1>
            {appointments.length === 0 && <p>No appointments to display.</p>}
            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment.id}>
                        {appointment.name} - {appointment.date} <br />
                        {appointment.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
