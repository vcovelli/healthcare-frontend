import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./api/firebaseConfig";
import Navbar from "./components/Navbar"; // Import Navbar
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import ClientDashboard from "./pages/ClientDashboard"; // Import ClientDashboard
import { fetchAppointments, createAppointment, deleteAppointment } from "./api/appointmentsAPI"; // Import API calls
import HomePage from "./pages/HomePage"; // Import HomePage
import AppointmentCard from "./components/AppointmentCard";

// App Component
function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // State for user role
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from backend when component mounts
  useEffect(() => {
    const loadAppointments = async () => {
      if (!user) {
        console.error("User is not authenticated. Cannot fetch appointments.");
        return;
      }

      try {
        const token = await user.getIdToken(); // Ensure `user` is valid before calling this
        const appointmentsData = await fetchAppointments(token);
        console.log("Appointments fetched from API:", appointmentsData); // Debug log
        setAppointments(appointmentsData); // Update state with backend data
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    loadAppointments();
  }, [user]); // Ensure this runs only when `user` changes

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser); // Debug log
      if (currentUser) {
        setUser(currentUser);

        // Fetch user role from backend
        try {
          const token = await currentUser.getIdToken();
          const response = await fetch("http://127.0.0.1:8000/api/profiles/", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role); // Set user role for Navbar
          } else {
            console.error("Failed to fetch user role:", response.statusText);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUser(null); // No user is authenticated
        setUserRole(null);
      }
      setLoading(false); // Stop the loader
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Debugging: Log current state
  console.log("App.js - Current State:", {
    user,
    userRole,
    loading,
    isModalOpen,
    currentAppointment,
    appointments,
  });

  // Show loader or unauthorized message
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return <p>You are not authorized to view this page. Please log in.</p>;
  }

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentAppointment(null);
  };

  const handleCreateAppointment = (date) => {
    console.log("Creating appointment for date:", date); // Debugging
    setModalOpen(true);
    setCurrentAppointment({
      date,
      time: "",
      title: "",
    });
  };
    

    // Handle save logic for new and updated appointments
  const handleSave = async (updatedAppointment) => {
    if (!updatedAppointment.id) {
      try {
        const newAppointment = await createAppointment(updatedAppointment);
        setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
      } catch (error) {
        console.error("Error creating appointment:", error);
      }
    } else {
      // Update existing appointment
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        )
      );
    }  
    closeModal();
  };

      // Function to delete an appointment
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(id);
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment.id !== id)
        );
        console.log(`Appointment with ID ${id} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

    return (
        <div className="p-0 bg-gray-100 min-h-screen">
          <Navbar userRole={userRole} />
          <Routes>
            <Route
              path="/*"
              element={<HomePage user={user} appointments={appointments} />}
            />
            <Route
              path="/client-dashboard"
              element={
                <>
                  {console.log("Props passed to ClientDashboard:", {
                    onCreateAppointment: handleCreateAppointment,
                    onEdit: (appointment) => {
                      setCurrentAppointment(appointment);
                      setModalOpen(true);
                    },
                    onDelete: handleDelete,
                    appointments,
                })}
                <ClientDashboard
                  onCreateAppointment={handleCreateAppointment}
                  onEdit={(appointment) => {
                    setCurrentAppointment(appointment);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  appointments={appointments}
                />
              </>
              }
            />
          </Routes>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            appointment={currentAppointment}
            onSave={(updatedAppointment) => {
              if (!updatedAppointment.id) {
                createAppointment(updatedAppointment).then((newAppt) =>
                  setAppointments((prev) => [...prev, newAppt])
                );
              }
            }}
          />
          <Footer />
        </div>
    );
  }
  
  export default App;
