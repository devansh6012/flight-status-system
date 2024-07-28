import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { handleForegroundMessages, requestPermission } from '../firebase';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [registeredUser, setRegisteredUser] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [fcmToken, setFcmToken] = useState('');
  const [currentFlightId, setCurrentFlightId] = useState('');

  useEffect(() => {
    fetchFlights();
    handleForegroundMessages();
    const interval = setInterval(fetchFlights, 60000); // Fetch every 60 seconds

    // Request permission and token on mount
    requestPermission(setFcmToken);

    // Check if the user is registered when the token is generated
    if (fcmToken) {
      checkUserRegistration(fcmToken);
    }

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [fcmToken]);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/flights');
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flight data:', error);
    }
  };

  const checkUserRegistration = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users?token=${token}`);
      if(response.data._id){
          setRegisteredUser(true);
      }
    } catch (error) {
      console.error('Error checking user registration:', error);
    }
  };

  const handleSubscribe = async (flightId) => {
    if (registeredUser) {
      // Subscribe user to the flight
      try {
        await axios.post('http://localhost:5000/api/flights/subscribe', {
          flightId,
          token: fcmToken
        });
        alert('Subscribed to flight successfully!');
      } catch (error) {
        console.error('Error subscribing to flight:', error);
      }
    } else {
      setCurrentFlightId(flightId);
      setShowPopup(true);
    }
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', {
        ...userData,
        token: fcmToken
      });
      setRegisteredUser(true);
      setShowPopup(false);
      alert('Registered successfully!');
      // Automatically subscribe after registration
      await handleSubscribe(currentFlightId);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="flight-status-container">
      <h2>Current Flight Status</h2>
      <table className="flight-status-table">
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Status</th>
            <th>Gate</th>
            <th>Time of Departure</th>
            <th>From</th>
            <th>To</th>
            <th>Subscribe</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight._id}>
              <td className="flight-number">{flight.number}</td>
              <td>{flight.status}</td>
              <td>{flight.gate}</td>
              <td>{flight.time_of_departure}</td>
              <td>{flight.from}</td>
              <td>{flight.to}</td>
              <td>
                <button onClick={() => handleSubscribe(flight._id)}>
                  Subscribe
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <h3>Register to Subscribe</h3>
          <form onSubmit={handlePopupSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Flights;
