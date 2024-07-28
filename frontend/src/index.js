import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './App.css';

// Import your components
// import FlightStatus from './components/FlightStatus';
import AdminPage from './components/AdminPage';
import Navbar from './components/Navbar';
import Flights from './components/Flights';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <Navbar />
        <div className="main-content">
          <Flights />
        </div>
      </div>
    ),
  },
  {
    path: 'flights',
    element: (
      <div>
        <Navbar />
        <div className="main-content">
          <Flights />
        </div>
      </div>
    ),
  },
  {
    path: 'admin',
    element: (
      <div>
        <Navbar />
        <div className="main-content">
          <AdminPage />
        </div>
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
