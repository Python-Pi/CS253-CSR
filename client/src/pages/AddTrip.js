import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddTrip = () => {
    const [info, setMessage] = useState("");
    const navigate = useNavigate();
    const [tripName, setTripName] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState('');

    const handleTripNameChange = (e) => {
        setTripName(e.target.value);
    };

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trip = {
            tripName: tripName,
            destination: destination,
            startDate: startDate,
            endDate: endDate,
            amount: amount
        };

        fetch(`http://${process.env.REACT_APP_IP}:8000/api/addTrip`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trip)
        })
        .then((res) => res.json())
        .then((data) => {

        });
    };



    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []);  
    
    if(!info.status){
        navigate('/home');
        return null;
    } else {
        if(!info.loggedIn){
            navigate('/home');
            return null;
        } else {
            return(
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div>
                        <h2>Add Trip</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Trip Name:</label>
                                <input type="text" className="form-control" value={tripName} onChange={handleTripNameChange} />
                            </div>
                            <div className="form-group">
                                <label>Destination:</label>
                                <input type="text" className="form-control" value={destination} onChange={handleDestinationChange} />
                            </div>
                            <div className="form-group">
                                <label>Start Date:</label>
                                <input type="date" className="form-control" value={startDate} onChange={handleStartDateChange} />
                            </div>
                            <div className="form-group">
                                <label>End Date:</label>
                                <input type="date" className="form-control" value={endDate} onChange={handleEndDateChange} />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input type="" className="form-control" value={amount} onChange={handleAmountChange} />
                            </div>
                            <button className="btn btn-primary mt-3" onClick={() => navigate('/travel')}>Create a new trip</button>
                        </form>
                    </div>
                </div>
            )
        }
    }
};

export default AddTrip;