import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [flights, setFlights] = useState([]);
    const [formData, setFormData] = useState({
      number: '',
      status: '',
      gate: '',
      time_of_departure: '',
      from: '',
      to: ''
    });
  
    const [updateData, setUpdateData] = useState(null);
  
    useEffect(() => {
      fetchFlights();
    }, []);
  
    const fetchFlights = async () => {
      const response = await axios.get('http://localhost:5000/api/flights');
      setFlights(response.data);
    };
  
    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await axios.post('http://localhost:5000/api/flights', formData);
      fetchFlights();
      setFormData({ number: '', status: '', gate: '', time_of_departure: '', from: '', to: '' });
    };
  
    const handleUpdateSubmit = async (e) => {
      e.preventDefault();
      await axios.put(`http://localhost:5000/api/flights/${updateData._id}`, {
        status: formData.status,
        gate: formData.gate,
        time_of_departure: formData.time_of_departure
      });
      fetchFlights();
      setFormData({ number: '', status: '', gate: '', time_of_departure: '', from: '', to: '' });
      setUpdateData(null);
    };
  
    const handleDelete = async (id) => {
      await axios.delete(`http://localhost:5000/api/flights/${id}`);
      fetchFlights();
    };
  
    const handleEditClick = (flight) => {
      setUpdateData(flight);
      setFormData(flight);
    };
  
    const handleCancelClick = () => {
      setUpdateData(null);
      setFormData({ number: '', status: '', gate: '', time_of_departure: '', from: '', to: '' });
    };
  
    return (
      <div className="admin-page-container">
        <h2>Admin Page</h2>
        <form onSubmit={updateData ? handleUpdateSubmit : handleSubmit}>
          <input
            type="text"
            name="number"
            placeholder="Flight Number"
            value={formData.number}
            onChange={handleInputChange}
            required
            readOnly={!!updateData}
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="gate"
            placeholder="Gate"
            value={formData.gate}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="time_of_departure"
            placeholder="Time of Departure"
            value={formData.time_of_departure}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="from"
            placeholder="From"
            value={formData.from}
            onChange={handleInputChange}
            required
            readOnly={!!updateData}
          />
          <input
            type="text"
            name="to"
            placeholder="To"
            value={formData.to}
            onChange={handleInputChange}
            required
            readOnly={!!updateData}
          />
          <button type="submit">{updateData ? 'Update Flight' : 'Add Flight'}</button>
          {updateData && <button type="button" className="cancel-btn" onClick={handleCancelClick}>Cancel</button>}
        </form>
        <table className="flights-table">
          <thead>
            <tr>
              <th>Flight Number</th>
              <th>Status</th>
              <th>Gate</th>
              <th>Time of Departure</th>
              <th>From</th>
              <th>To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight._id}>
                <td>{flight.number}</td>
                <td>{flight.status}</td>
                <td>{flight.gate}</td>
                <td>{flight.time_of_departure}</td>
                <td>{flight.from}</td>
                <td>{flight.to}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(flight)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(flight._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AdminPage;
