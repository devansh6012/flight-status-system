import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                {/* <li><Link to="/flight-status">Flight Status</Link></li> */}
                <li><Link to="/flights">Flights</Link></li>
                <li><Link to="/admin">Admin</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
