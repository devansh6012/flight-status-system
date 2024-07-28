import React from 'react';
import Navbar from './components/Navbar';
import FlightStatus from './components/FlightStatus';
import AdminPage from './components/AdminPage';
import './App.css';


function App() {
    return (
        <div>
            {/* <Navbar /> */}
            <FlightStatus />
            <AdminPage />

        </div>
    );
}

export default App;
