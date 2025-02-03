# Healthcare Frontend

A React-based frontend application for managing healthcare appointments, including features like a calendar view, appointment creation, and editing functionalities.

---

## **Features**

- **Appointment Management**: Create, view, edit, and delete appointments.
- **Calendar Integration**: View appointments in a calendar interface.
- **Role-Based Access**: Separate views for clients, staff, and admins.
- **Responsive Design**: Optimized for desktop and mobile devices.

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd healthcare-frontend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and add the required environment variables:
```env
REACT_APP_API_URL=<backend-api-url>
```

### **4. Start the Development Server**
```bash
npm start
```
The app will be available at: [http://localhost:3000](http://localhost:3000)

---

## **Project Structure**

```
.
├── src
│   ├── api          # API integration files (e.g., axios setup, endpoints)
│   ├── components   # Reusable components (Navbar, Header, etc.)
│   ├── pages        # Page-level components (ClientDashboard, AdminDashboard, etc.)
│   ├── utils        # Utility functions (date formatting, authentication helpers)
│   ├── App.js       # Main application component
│   └── index.js     # Application entry point
├── public
│   ├── index.html   # HTML template
│   └── favicon.ico  # Favicon
└── package.json     # Project metadata and dependencies
```

---

## **Technologies Used**

- **React**: Frontend library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **FullCalendar**: Calendar library for managing and displaying appointments.
- **Axios**: HTTP client for API requests.
- **Tippy.js**: Tooltip library for enhanced UI interactions.

---

## **Scripts**

### **Start Development Server**
```bash
npm start
```
Runs the app in development mode.

### **Build for Production**
```bash
npm run build
```
Creates a production-ready build in the `build` folder.

---

## **Deployment**

This application can be deployed on platforms like **Vercel**, **Netlify**, or any static hosting service. Ensure the backend API URL is correctly configured in the `.env` file during deployment.

---

## **Environment Variables**

Ensure the following variables are set in your environment:

- `REACT_APP_API_URL`: The base URL for the backend API.

---

## **Notes**

- Always run `npm install` after pulling the latest changes to ensure dependencies are up to date.
- For production builds, ensure that all required environment variables are correctly set.
- Refer to the backend repository for API documentation and setup.

