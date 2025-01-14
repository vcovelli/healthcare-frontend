import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import './output.css'; // Use the generated output file
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
